/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	global._directory_base = __dirname;
	global.config = {};
		  config.app = require( './config/app.js' );
		  config.database = require( './config/database.js' )[config.app.env];

	//Model
	const ViewUserAuth = require( _directory_base + '/app/v1.1/Http/Models/ViewUserAuthModel.js' );

	//Controller
	const Notification = require( _directory_base + '/app/v1.1/Http/Controllers/NotificationController.js' );
	const Security = require( _directory_base + '/app/v1.1/Http/Libraries/Security.js' );
/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
	// Node Modules
	const BodyParser = require( 'body-parser' );
	const Express = require( 'express' );
	const Mongoose = require( 'mongoose' );
	const ExpressUpload = require( 'express-fileupload' );
	const CronJob = require( 'cron' ).CronJob;
	// Primary Variable
	const App = Express();

	// Producer = kafka.Producer,
	// Consumer = kafka.Consumer,
	// client = new kafka.KafkaClient({kafkaHost : "149.129.252.13:9092"}),
	// producer = new Producer(client),    
	// consumer = new Consumer(
    //     client,
    //     [
    //         { topic: 'kafkaRequestData', partition: 0 },{ topic: 'kafkaDataCollectionProgress', partition: 0 },{ topic: 'kafkaResponse', partition: 0 }
    //     ],
    //     {
    //         autoCommit: false
    //     }
    // );
	// consumer.on('message', function (message) {
	// 	json_message = JSON.parse(message.value);
	// 	if(message.topic=="kafkaRequestData"){
	// 		//ada yang request data ke microservices
	// 		let reqDataObj;
	// 		let responseData = false;
	// 		if(json_message.msa_name=="auth"){
	// 			const matchJSON = JSON.parse( json_message.agg );
	// 			const set = ViewUserAuth.aggregate( [	
	// 				matchJSON[0]
	// 			] );
	// 			reqDataObj = {
	// 				"msa_name":json_message.msa_name,
	// 				"model_name":json_message.model_name,
	// 				"requester":json_message.requester,
	// 				"request_id":json_message.request_id,
	// 				"data": set
	// 			}
	// 			responseData = true;
	// 		}
	// 		if( responseData ){
	// 			let payloads = [
	// 				{ topic: "kafkaResponseData", messages: JSON.stringify( reqDataObj ), partition: 0 }
	// 			];
	// 			producer.send( payloads, function( err, data ){
	// 				console.log( "Send data to kafka", data );
	// 			} );
	// 		}
	// 	}
	// });

	// Generate API Documentation
	// require( 'express-aglio' )( App,{
	// 	source: __dirname+ '/docs/source/index.md',
	// 	output: __dirname+ '/docs/html/index.html',
	// 	aglioOptions: {
	// 		themeCondenseNav: true,
	// 		themeTemplate: 'triple',
	// 		themeVariables: 'streak'
	// 	}
	// } );

/*
|--------------------------------------------------------------------------
| APP Init
|--------------------------------------------------------------------------
*/
	// Routing Folder
	App.use( '/files', Express.static( 'public' ) );

	// Parse request of content-type - application/x-www-form-urlencoded
	App.use( BodyParser.urlencoded( { extended: false } ) );

	// Parse request of content-type - application/json
	App.use( BodyParser.json() );

	// Add Express Upload to App
	App.use( ExpressUpload() );

	// Setup Database
	Mongoose.Promise = global.Promise;
	Mongoose.connect( config.database.url, {
		useNewUrlParser: true,
		ssl: config.database.ssl
	} ).then( () => {
		console.log( "Database :" );
		console.log( "\tStatus \t\t: Connected" );
		console.log( "\tMongoDB URL \t: " + config.database.url + " (" + config.app.env + ")" );
	} ).catch( err => {
		console.log( "Database :" );
		console.log( "\tDatabase Status : Not Connected" );
		console.log( "\tMongoDB URL \t: " + config.database.url + " (" + config.app.env + ")" );
	} );

	// Server Running Message
	App.listen( parseInt( config.app.port[config.app.env] ), () => {
		console.log( "Server :" );
		console.log( "\tStatus \t\t: OK" );
		console.log( "\tService \t: " + config.app.name + " (" + config.app.env + ")" );
		console.log( "\tPort \t\t: " + config.app.port[config.app.env] );
	} );

/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	require( './routes/api.js' )( App );

/*
 |--------------------------------------------------------------------------
 | Cron Push notificatin Firebase
 |--------------------------------------------------------------------------
 */
	const admin = require( 'firebase-admin' );
	const serviceAccount = require( _directory_base + '/public/key/push-notification.json' );
	admin.initializeApp( {
		credential: admin.credential.cert( serviceAccount ),
		databaseURL: "https://mobile-inspection-257403.firebaseio.com"
	} );
	new CronJob( '* * * * *', function () {
		var claims = {
			USERNAME: 'ferdinand',
			USER_AUTH_CODE: '0102',
			IMEI: '123txxx',
			LOCATION_CODE: 'ALL'
		};
		let token = Security.generate_token( claims ); // Generate Token
		Notification.push_notification( admin, token );
	}, null, true );

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = App;