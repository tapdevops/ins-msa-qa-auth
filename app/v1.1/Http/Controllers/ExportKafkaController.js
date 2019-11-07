/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
	// Models
    const UserAuth = require( _directory_base + '/app/v1.1/Http/Models/UserAuthModel.js' );
    
    // Libraries
	const KafkaServer = require( _directory_base + '/app/v1.1/Http/Libraries/KafkaServer.js' );
		
	

 /*
 |--------------------------------------------------------------------------
 | Versi 1.1
 |--------------------------------------------------------------------------
 */
        exports.export_kafka = async ( req, res ) => {
            try{
                const query = await UserAuth.aggregate( [
                    {
                        $project: {
                            _id: 0
                        }
                    }
                ] );
                let i = 0;
                query.forEach( function( data ) {
                    var kafka_body = {
                        URACD: data.USER_AUTH_CODE,
                        EMNIK: data.EMPLOYEE_NIK,
                        URROL: data.USER_ROLE,
                        LOCCD: data.LOCATION_CODE,
                        RROLE: data.REF_ROLE,
                        INSUR: data.DELETE_TIME,
                        INSTM: data.INSERT_TIME,
                        UPTUR: data.USER_AUTH_CODE,
                        UPTTM: data.UPDATE_TIME,
                        DLTUR: data.DELETE_USER,
                        DLTTM: data.DELETE_TIME
                    };
                    KafkaServer.producer( 'INS_MSA_AUTH_TM_USER_AUTH', JSON.stringify( kafka_body ) );
                    // console.log( ++i );
                } );
    
                res.status(201).send( {
                    status: true
                } );
            } 
            catch( err ) {
                res.status(404).send( {
                    status: false
                } )
            }
        }

        exports.find_by_month = async ( req, res ) => {
            let start = req.params.month;
            if ( isNaN( parseInt( start ) ) || start.length !== 6 ) {
                return res.send( {
                    status: false,
                    message: 'Periksa Param Bulan',
                    data: {}
                } );
            }
            let end;
            if ( start.substring( 4, 6 ) === '12' ) {
                end = parseInt( start ) + 100;
            } else {
                end = parseInt( start ) + 1;
            }
            try {
                const userCount = await UserAuth.countDocuments( {
                    INSERT_TIME: {
                        $gte: parseInt( start + '01000000' ),
                        $lte: parseInt( end + '01000000' )
                    }
                } );
                res.send( {
                    status: true,
                    message: 'Data dari ' + start + '01000000 sampai ' + end + '01000000',
                    data: {
                        TM_USER_AUTH: userCount
                    }    
                } );
            } catch ( error ) {
                res.send( {
                    status: false,
                    message: 'Internal Server Error: ' + error.message,
                    data: []
                } );
            }
        }