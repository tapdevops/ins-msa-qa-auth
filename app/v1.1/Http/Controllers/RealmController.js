/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | aUntuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const Realm = require( 'realm' );
    const FileServer = require( 'fs' );
    const FileSystem = require( 'file-system' );
    const Terminal = require( 'child_process' ).execSync;
    const csv = require( 'csv-parser' );
    const csvToJson = require( 'csvtojson' );
    const Helper = require( _directory_base + '/app/v1.1/Http/Libraries/Helper.js' );

 /*
 |--------------------------------------------------------------------------
 | Versi 1.1
 |--------------------------------------------------------------------------
 */
    exports.read_realm = async ( req, res ) => {
        let fileName = _directory_base + '/public/tmp/import-db-realm/TAC00004-20191114170226-TR_FINDING.csv';
        
        // let headersEBCCHeader = 'EBCC_VALIDATION_CODE,WERKS,AFD_CODE,BLOCK_CODE,NO_TPH,STATUS_TPH_SCAN,ALASAN_MANUAL,LAT_TPH,LON_TPH,DELIVERY_CODE,STATUS_DELIVERY_CODE,TOTAL_JANJANG,STATUS_SYNC,SYNC_TIME,INSERT_USER,INSERT_TIME,SYNC_IMAGE,SYNC_DETAIL\n'
        // let headersEBCCDetail = "EBCC_VALIDATION_CODE_D,EBCC_VALIDATION_CODE,GROUP_KUALITAS,UOM,ID_KUALITAS,NAMA_KUALITAS,JUMLAH,INSERT_TIME,INSERT_USER,STATUS_SYNC,SYNC_TIME\n";
        // let headersInspectionDetail = "BLOCK_INSPECTION_CODE_D,BLOCK_INSPECTION_CODE,ID_INSPECTION,CONTENT_INSPECTION_CODE,VALUE,AREAL,STATUS_SYNC,INSERT_USER,INSERT_TIME\n";
        let headersFinding = "FINDING_CODE,WERKS,AFD_CODE,BLOCK_CODE,FINDING_CATEGORY,FINDING_DESC,FINDING_PRIORITY,DUE_DATE,STATUS,ASSIGN_TO,PROGRESS,LAT_FINDING,LONG_FINDING,REFFERENCE_INS_CODE,INSERT_USER,INSERT_TIME,UPDATE_USER,UPDATE_TIME,STATUS_SYNC,RATING,RATING_MESSAGE,END_TIME,SYNC_IMAGE\n"
        let file = FileServer.readFileSync( fileName, 'utf8' )

        let c = headersFinding + file
        let result = [];
        await csvToJson().fromString(c)
        .then((json) => {
            result =  json ;
        } )
        //EDIT FIELD EBCC_VALIDATION_D
        /*for ( let i = 0; i < result.length; i++ ) {
            result[i].JUMLAH = parseInt( result[i].JUMLAH );
            result[i].EBCC_VALIDATION_CODE_D = undefined;
            result[i].UOM = undefined;
            result[i].GROUP_KUALITAS = undefined;
            result[i].NAMA_KUALITAS = undefined;
            result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
            result[i].SYNC_TIME = result[i].SYNC_TIME === "" ? 0 : parseInt( result[i].SYNC_TIME ) 
        }*/
        for ( let i = 0; i < result.length; i++ ) {
            result[i].DUE_DATE = result[i].DUE_DATE === "" ? 0 : parseInt( Helper.date_format( result[i].DUE_DATE, 'YYYYMMDDhhmmss' ) );
            result[i].PROGRESS = parseInt( result[i].PROGRESS );
            result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
            result[i].UPDATE_TIME = result[i].UPDATE_TIME === "" ? 0 : parseInt( Helper.date_format( result[i].UPDATE_TIME, 'YYYYMMDDhhmmss' ) );
            result[i].END_TIME = undefined;
            result[i].SYNC_IMAGE = undefined;
            result[i].RATING_MESSAGE = undefined;
            result[i].RATING = undefined;
            result[i].STATUS_SYNC = undefined;
            result[i].STATUS = undefined;
            result[i].DELETE_USER = "";
            result[i].DELETE_TIME = 0;
        }
        res.send( {
            data: result
        } );
    }
    exports.read_realm_ = async ( req, res ) => {
        if ( !req.files ) {
            return res.send( {
                status: false,
                message: config.error_message.invalid_input + ' REQUEST FILES.',
                data: {}
            } );
        }
        let file = req.files.REALM;
        
        if ( req.files.mimetype = 'application/octet-stream' ) {
            file.name = req.auth.USER_AUTH_CODE + '-' + Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) + '.realm';
            let filename = file.name;
            let directory = _directory_base + '/public/tmp/import-db-realm/' + filename;
            try{
                await file.mv( directory );
            } catch( error ) {

            }
            
            var options = {
                encoding: 'utf8'
            };
            let tables = [ 'TM_AFD', 'TR_FINDING' ];
            for ( let i = 0; i < tables.length; i++ ) {
                var newFileName = './public/tmp/import-db-realm/' + req.auth.USER_AUTH_CODE + '-' + Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) + '-' + tables[i] + '.csv';
                let cmd = "realm-exporter export " + directory + ' ' + tables[i] + ' > ' + newFileName;
                
                console.log( Terminal( cmd, options ) );
                console.log( cmd )
            //     FileServer.createReadStream( newFileName )
            //     .pipe( csv() )
            //     .on( 'data', ( data ) => results.push( data ) )
            //     .on( 'end', () => {
            //     console.log( results );
            // } )
            }
            let results = [];
            
            res.send( {
                message: 'Success!'
            } );
            
        } else {
            res.send( {
                status: false,
                message: 'Upload file dengan ekstensi .realm',
                data: {}
            } )
        }
    }