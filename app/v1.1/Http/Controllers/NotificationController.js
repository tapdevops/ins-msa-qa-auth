/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | aUntuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const admin = require( 'firebase-admin' );
    const serviceAccount = require( _directory_base + '/public/key/push-notification.json' );
    const UserAuth =  require( _directory_base + '/app/v1.1/Http/Models/UserAuthModel.js' );

    //push notifikasi ke firebase
    exports.push_notification = async ( req, res ) => {
        try {
            let firebaseTokens = await UserAuth.aggregate( [
                {
                    $project: {
                        _id: 0,
                        FIREBASE_TOKEN: 1
                    }
                }
            ] );
            let payload = {
                notification: {
                    title: 'Example',
                    body: 'Hai!!!'
                },
                data: {
                    DEEPLINK: 'RESTAN'
                }
            }
            let options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            }
            admin.initializeApp( {
                credential: admin.credential.cert( serviceAccount ),
                databaseURL: "https://mobile-inspection-257403.firebaseio.com"
            } );
            let firebaseToken = [ 'eGHV-Z6G95c:APA91bGDrEG1m037Ac9rwF6sslByi1giruNkX0uN71_LePUzZf90I6L_0jmOEJFmm6xbjgU4g68c50rech25FM8pVdq1WixiSU3ICf24HqIXJQCimBeoN-bGPh58RvAXTKzC4FbdcnTf' ];
            admin.messaging().sendToDevice( firebaseToken, payload, options )
            .then( response => {
                console.log( 'Successfully sent message', response );
                res.send( 'Sukses' );
            } ).catch ( error => {
                console.log( 'Error sending message: ', error );
                res.send( err );
            } );
        } catch ( err ) {
            res.send( err );
        }
    }
//         POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send HTTP/1.1

// Content-Type: application/json
// Authorization: Bearer ya29.ElqKBGN2Ri_Uz...PbJ_uNasm

// {
//   "message": {
//     "token" : <token of destination app>,
//     "notification": {
//       "title": "FCM Message",
//       "body": "This is a message from FCM"
//     },
//     "webpush": {
//       "headers": {
//         "Urgency": "high"
//       },
//       "notification": {
//         "body": "This is a message from FCM to web",
//         "requireInteraction": "true",
//         "badge": "/badge-icon.png"
//       }
//     }
//   }
// }
//     }


