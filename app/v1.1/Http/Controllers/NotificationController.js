/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const UserAuth =  require( _directory_base + '/app/v1.1/Http/Models/UserAuthModel.js' );
    const admin = require( 'firebase-admin' );
    const serviceAccount = require( _directory_base + '/public/key/push-notification.json' );
    const Helper = require( _directory_base + '/app/v1.1/Http/Libraries/Helper.js' );
	const Client = require( 'node-rest-client' ).Client;
    const client = new Client();
    //push notifikasi ke firebase
    exports.push_notification = async ( admin, token ) => {
        // admin.initializeApp( {
        //     credential: admin.credential.cert( serviceAccount ),
        //     databaseURL: "https://mobile-inspection-257403.firebaseio.com"
        // } );
        try {
            let date = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ).substring( 0, 8 ) ) - 1;
            const url = config.app.url[config.app.env].microservice_reports + `/api/v1.1/report/taksasi/${date}`;
            let args = {
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            // const url = config.app.url[config.app.env].microservice_reports + `/api/v1.1/report/taksasi/20191124`;
            let request = client.get( url, args, async function ( data, response ) {
                console.log( `Data: ${data}` );
                if ( data ) {
                    data.data.forEach( async function ( dt ) {
                        let users = await UserAuth.aggregate( [
                            {
                                $match: {
                                    USER_ROLE: 'ASISTEN_LAPANGAN',
                                    LOCATION_CODE: new RegExp( dt.OTORISASI )
                                }
                            }
                        ] );
                        users.forEach( ( user ) => {
                            // if ( dt.OTORISASI === '5121A' ) {
                                if ( user.FIREBASE_TOKEN ) {
                                    let payload = {
                                        notification: {
                                            title: 'Mobile Inspection',
                                            body: 'Hey, ada ' + dt.TOTAL + ' kg restan yang harus diangkut hari ini.'
                                        },
                                        data: {
                                            DEEPLINK: 'RESTAN'
                                        }
                                    }
                                    let options = {
                                        priority: 'high',
                                        timeToLive: 60 * 60 * 24
                                    }
                                    let firebaseToken = [ user.FIREBASE_TOKEN ];
                                    admin.messaging().sendToDevice( firebaseToken, payload, options )
                                    .then( response => {
                                        console.log( user.FIREBASE_TOKEN );
                                        console.log( user.USER_AUTH_CODE );
                                        console.log( dt.TOTAL );
                                        console.log( 'Successfully push notification', response.results[0] );
                                    } ).catch ( error => {
                                        console.log( 'Error sending message: ', error );
                                    } );
                                }
                            // }
                        } );        
                    } );
                }
            } );
            request.on( 'error', ( error ) => {
                console.log( error.message );
            } );
            // res.send( {
            //     messge: 'Success'
            // } );
        } catch ( err ) {
            console.log( err.message );
        }
    }
    exports.verifyFCMToken = ( fcmToken ) => {
        return admin.messaging().send( {
            token: fcmToken
        }, true )
    }


