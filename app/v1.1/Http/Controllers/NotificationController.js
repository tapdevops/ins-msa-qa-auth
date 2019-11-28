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
                data: {
                    Mykey: 'Welcome Firebase'
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
            admin.messaging().sendToDevice( 'klkj', payload, options )
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


