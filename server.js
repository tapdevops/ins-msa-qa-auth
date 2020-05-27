/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
global._directory_base = __dirname;
global.config = {};
config.app = require('./config/app.js');
config.database = require('./config/database.js')[config.app.env];

//Model
const Security = require(_directory_base + '/app/v2.0/Http/Libraries/Security.js');
/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
// Node Modules
const BodyParser = require('body-parser');
const Express = require('express');
const Mongoose = require('mongoose');
const ExpressUpload = require('express-fileupload');
const CronJob = require('cron').CronJob;
const timeout = require('connect-timeout');

// Primary Variable
const App = Express();


/*
|--------------------------------------------------------------------------
| APP Init
|--------------------------------------------------------------------------
*/
	// Routing Folder
	App.use('/files', Express.static('public'));

	// Parse request of content-type - application/json
	App.use(BodyParser.json({ limit: '50mb' }));

	// Parse request of content-type - application/x-www-form-urlencoded
	App.use(BodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 5000000 }));

	// Add Express Upload to App
	App.use(ExpressUpload({
		limits: { fileSize: 50 * 1024 * 1024 }
	}));

	// Setup Database
	Mongoose.Promise = global.Promise;
	Mongoose.connect(config.database.url, {
		useNewUrlParser: true,
		ssl: config.database.ssl,
		useUnifiedTopology: true 
	}).then(() => {
		console.log("Database :");
		console.log("\tStatus \t\t: Connected");
		console.log("\tMongoDB URL \t: " + config.database.url + " (" + config.app.env + ")");
	}).catch(err => {
		console.log("Database :");
		console.log("\tDatabase Status : Not Connected");
		console.log("\tMongoDB URL \t: " + config.database.url + " (" + config.app.env + ")");
	});

	// Server Running Message
	App.listen(parseInt(config.app.port[config.app.env]), () => {
		console.log("Server :");
		console.log("\tStatus \t\t: OK");
		console.log("\tService \t: " + config.app.name + " (" + config.app.env + ")");
		console.log("\tPort \t\t: " + config.app.port[config.app.env]);
	});

	//set timeout 5 minutes
	App.use(timeout('300s'))

/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
require('./routes/api.js')(App);

/*
 |--------------------------------------------------------------------------
 | Cron Push notification Firebase
 |--------------------------------------------------------------------------
 */
const admin = require('firebase-admin');
const serviceAccount = require(_directory_base + '/public/key/push-notification.json');
const Kernel = require(_directory_base + '/app/v2.0/Console/Kernel.js');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://mobile-inspection-257403.firebaseio.com"
});
new CronJob('0 3 * * *', function () {
	var claims = {
		USERNAME: 'ferdinand',
		USER_AUTH_CODE: '0102',
		IMEI: '123txxx',
		LOCATION_CODE: 'ALL'
	};
	let token = Security.generate_token(claims); // Generate Token
	console.log('running cron');
	Kernel.pushNotification(admin, token);
}, null, true, 'Asia/Jakarta');

/*
 |--------------------------------------------------------------------------
 | Cron Push all users
 |--------------------------------------------------------------------------
 */

new CronJob('0 0 * * *', function () {
	Kernel.pushAllUsers()
}, null, true, 'Asia/Jakarta');
/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = App;
