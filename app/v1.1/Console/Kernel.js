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

/*
|--------------------------------------------------------------------------
| Kernel
|--------------------------------------------------------------------------
|
| In the past, you may have generated a Cron entry for each task you needed
| to schedule on your server. However, this can quickly become a pain,
| because your task schedule is no longer in source control and you must
| SSH into your server to add additional Cron entries.
|
*/
    class Kernel {
        //push notifikasi ke firebase
        async pushNotification ( admin, token ) {
            try {
                let args = {
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
                const url = config.app.url[config.app.env].microservice_reports + `/api/v1.1/report/taksasi`;
                console.log( url );
                let request = client.get( url, args, async function ( data, response ) {
                    if ( data ) {
                        console.log( data.data );
                        if ( data.data.length == 0 ) {
                            return console.log( `Data titik restan pada tanggal ini kosong!` );
                        }
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
                                    let total = ( dt.TOTAL / 1000).toFixed(2).toString().replace(".", ",")
                                    let payload = {
                                        notification: {
                                            title: 'Mobile Inspection',
                                            body: 'Hey, ada ' + total + ' ton restan yang harus diangkut hari ini.'
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
                                        console.log( 'Sending notification to ' + user.USER_AUTH_CODE + ': ', response.results[0] );
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
            } catch ( err ) {
                console.log( err.message );
            }
        }
        verifyFCMToken ( fcmToken ) {
            return admin.messaging().send( {
                token: fcmToken
            }, true )
        }
    }

/*
|--------------------------------------------------------------------------
| Module export
|--------------------------------------------------------------------------
*/

module.exports = new Kernel();