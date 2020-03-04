/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
const UserAuth = require(_directory_base + '/app/v2.0/Http/Models/UserAuthModel.js');
const admin = require('firebase-admin');
const serviceAccount = require(_directory_base + '/public/key/push-notification.json');
const Helper = require(_directory_base + '/app/v2.0/Http/Libraries/Helper.js');
const Client = require('node-rest-client').Client;
const client = new Client();
const KafkaServer = require(_directory_base + '/app/v2.0/Http/Libraries/KafkaServer.js')

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
    async pushNotification(admin, token) {
        try {
            let args = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const url = config.app.url[config.app.env].msa_internal_tap + `/api/v1.0/taksasi`;
            let request = client.get(url, args, async function (data, response) {
                if (data.data) {
                    if (data.data.length == 0) {
                        return console.log(`Data titik restan pada tanggal ini kosong!`);
                    }
                    data.data.forEach(async function (dt) {
                        let users = await UserAuth.aggregate([
                            {
                                $match: {
                                    USER_ROLE: 'ASISTEN_LAPANGAN',
                                    LOCATION_CODE: new RegExp(dt.OTORISASI)
                                }
                            }
                        ]);
                        users.forEach((user) => {
                            // if ( dt.OTORISASI === '5121A' ) {
                            if (user.FIREBASE_TOKEN) {
                                let total = (dt.TOTAL / 1000).toFixed(2).toString().replace(".", ",")
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
                                let firebaseToken = [user.FIREBASE_TOKEN];
                                admin.messaging().sendToDevice(firebaseToken, payload, options)
                                    .then(response => {
                                        console.log('Sending notification to ' + user.USER_AUTH_CODE + ': ', response.results[0]);
                                    }).catch(error => {
                                        console.log('Error sending message: ', error);
                                    });
                            }
                            // }
                        });
                    });
                }
            });
            request.on('error', (error) => {
                console.log(error.message);
            });
        } catch (err) {
            console.log(err.message);
        }
    }
    verifyFCMToken(fcmToken) {
        return admin.messaging().send({
            token: fcmToken
        }, true)
    }

    async pushAllUsers() {
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
            } );
        } 
        catch( err ) {
            console.log(err)
        }
    }
}

/*
|--------------------------------------------------------------------------
| Module export
|--------------------------------------------------------------------------
*/

module.exports = new Kernel();