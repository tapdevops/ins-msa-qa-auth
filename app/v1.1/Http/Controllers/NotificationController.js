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
	
    //push notifikasi ke firebase
    exports.push_notification = async () => {
        // admin.initializeApp( {
        //     credential: admin.credential.cert( serviceAccount ),
        //     databaseURL: "https://mobile-inspection-257403.firebaseio.com"
        // } );
        try {
            let users = await UserAuth.aggregate( [
                {
                    $project: {
                        _id: 0,
                        FIREBASE_TOKEN: 1
                    }
                }
            ] );
            users.forEach( ( user ) => {
                if ( user.FIREBASE_TOKEN ) {
                    this.verifyFCMToken( user.FIREBASE_TOKEN )
                    .then( () => {
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
                        let firebaseToken = [ user.FIREBASE_TOKEN ];
                        admin.messaging().sendToDevice( firebaseToken, payload, options )
                        .then( response => {
                            console.log( 'Successfully push notification', response.results[0] );
                        } ).catch ( error => {
                            console.log( 'Error sending message: ', error );
                        } );
                    } ).catch( err => {
                        console.log( `Token invalid: ${user.FIREBASE_TOKEN}` );
                    } );
                }
            } );
        } catch ( err ) {
            console.log( err.message );
        }
    }
    this.verifyFCMToken = ( fcmToken ) => {
        return admin.messaging().send( {
            token: fcmToken
        }, true )
    }


