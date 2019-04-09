/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
	// Group Routing
	require( 'express-group-routes' ); 

	// Node Modules
	const bodyParser = require( 'body-parser' );
	const Client = require('node-rest-client').Client;
	const express = require( 'express' );
	const expressUpload = require( 'express-fileupload' );
	const mongoose = require( 'mongoose' );
	const nJwt = require( 'njwt' );
	const uuid = require( 'uuid' );

	let bearerToken = require( 'express-bearer-token' ); 
	let bcrypt = require( 'bcryptjs' );
	let jwt = require( 'jsonwebtoken' ); 

	// Primary Variable
	const app = express();

	// Config
	const config2 = {};
		  config2.app = require( './config/config2.js' );
		  config2.database = require( './config/database2.js' )[config2.app.env];

	// Update
	const config = require( './config/config.js' ); 				// Config
	const dbConfig = require( './config/database.js' ); 			// Database Config
	const tokenLib = require( './app/libraries/token.js' ); 		// Token Config

/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	global._directory_base = __dirname;
	global.db = mongoose.connection;
	global._directory_root = '';

/*
|--------------------------------------------------------------------------
| Generate API Blueprint
|--------------------------------------------------------------------------
*/
	require( 'express-aglio' )( app,{
		source: __dirname+ '/docs/source/index.md',
		output: __dirname+ '/docs/html/index.html',
		aglioOptions: {
			themeCondenseNav: true,
			themeTemplate: 'triple',
			themeVariables: 'streak'
		}
	} );

/*
|--------------------------------------------------------------------------
| APP Init
|--------------------------------------------------------------------------
*/
	// Routing Folder
	app.use( '/files', express.static( 'public' ) );

	// Parse request of content-type - application/x-www-form-urlencoded
	app.use( bodyParser.urlencoded( { extended: false } ) );

	// Parse request of content-type - application/json
	app.use( bodyParser.json() );

	// Add Express Upload to App
	app.use( expressUpload() );

	// Setup Database

	mongoose.Promise = global.Promise;
	console.log(config2.database.url);
	mongoose.connect( config2.database.url, {
		useNewUrlParser: true,
		ssl: config2.database.ssl
	} ).then( () => {
		console.log( 'Konek ke: ' + config2.database.url );
		console.log( 'Successfully connected to the Database' );
	} ).catch( err => {
		console.log( 'Could not connect to the Database. Exiting application.' )
	} );

	// Server Running Message
	app.listen( config2.app.port, () => {
		console.log( 'Server ' + config2.app.name + ' Berjalan di port ' + config2.app.port );
	} );

	// Routing
	app.get( '/', ( req, res ) => {
		res.json( { 'message': config2.app.name } )
	} );

	// Login
	app.post( '/api/login', ( req, res ) => {

		//console.log(req.body.imei);

		if ( req.body.username && req.body.password ) {
			
			//if( !req.body.imei ) {
			//	return res.status( 400 ).send({
			//		status: false,
			//		message: 'Invalid IMEI',
			//		data: {}
			//	});
			//}

			var client = new Client();
			var url = config.url.microservices.ldap;
			var args = {
				data: {
					username: req.body.username,
					password: req.body.password
				},
				headers: { "Content-Type": "application/json" },
				requestConfig: {
					timeout: 3000, //request timeout in milliseconds
					noDelay: true, //Enable/disable the Nagle algorithm
					keepAlive: true, //Enable/disable keep-alive functionalityidle socket
				},
				responseConfig: {
					timeout: 10000
				}
			};
			
			// 1. Check ke LDAP
			console.log(url)
			client.post( url, args, function ( data, response ) {
				// 2.1. Kondisi data terdapat pada LDAP

				//console.log( data );
				//console.log( data );

				if ( data.status == true ) {
					
					const loginModel = require( './app/models/login.js' );
					const loginLib = require( './app/libraries/login.js' );
					const loginData = {};

					const employeeHRIS = require( './app/models/employeeHRIS.js' );
					const userAuth = require( './app/models/userAuth.js' );
					const pjs = require( './app/models/pjs.js' );

					employeeHRIS.findOne( { 
						EMPLOYEE_USERNAME: req.body.username
					} ).then( data => {

						// LOGIN via PJS
						if( !data ) {

							pjs.findOne( { 
								USERNAME: req.body.username
							} ).then( data => {
								if ( !data ) {
									return res.send({
										status: false,
										message: "User tersebut belum terdaftar (@PJS)",
										data: {}
									});
								}

								var data_pjs = data;

								// Kondisi data ada di PJS
								userAuth.findOne( { 
									EMPLOYEE_NIK: data_pjs.EMPLOYEE_NIK
								} ).then( data_auth => {

									console.log( 'Data yang dikirim :' );
									
									console.log( req.body );
									console.log( 'Data Login :' );
									console.log( data_auth );

									if ( !data_auth ) {
										return res.send({
											status: false,
											message: "User tersebut belum terdaftar (@PJS-2)",
											data: {}
										});
									}

									var claims = {
										USERNAME: req.body.username,
										USER_AUTH_CODE: data_auth.USER_AUTH_CODE,
										USER_ROLE: data_auth.USER_ROLE,
										LOCATION_CODE: data_auth.LOCATION_CODE,
										REFFERENCE_ROLE: data_auth.REF_ROLE,
										EMPLOYEE_NIK: data_auth.EMPLOYEE_NIK,
										IMEI: req.body.imei
									}

									var token = tokenLib.generateToken( claims );

									var login_request = {
										USER_AUTH_CODE: data_auth.USER_AUTH_CODE,
										EMPLOYEE_NIK: data_pjs.EMPLOYEE_NIK,
										USERNAME: data_pjs.USERNAME,
										ACCESS_TOKEN: token,
										LOG_LOGIN: '',
										IMEI: req.body.imei,
										INSERT_USER: '',
										INSERT_TIME: '',
										UPDATE_USER: data_pjs.USERNAME,
										DELETE_USER: '',
										DELETE_TIME: ''
									};


									loginLib.setLogin( login_request );

									// Kondisi data ada di PJS
									res.json({
										status: true,
										message: "Success",
										data: {
											USERNAME: data_pjs.USERNAME,
											NIK: data_pjs.EMPLOYEE_NIK,
											ACCESS_TOKEN: token,
											JOB_CODE: data_pjs.JOB_CODE,
											USER_AUTH_CODE: data_auth.USER_AUTH_CODE,
											REFFERENCE_ROLE: data_auth.REF_ROLE,
											USER_ROLE: data_auth.USER_ROLE,
											LOCATION_CODE: data_auth.LOCATION_CODE
										}
									});

								} ).catch( err => {
									if( err.kind === 'ObjectId' ) {
										return res.send({
											status: false,
											message: "Error retrieving user 4zzz",
											data: {}
										});
									}
									return res.status( 500 ).send({
										status: false,
										message: "Error retrieving user 3zzz",
										data: {}
									} );
								} );

							} ).catch( err => {
								if( err.kind === 'ObjectId' ) {
									return res.send({
										status: false,
										message: "Error retrieving user 4",
										data: {}
									});
								}
								return res.send({
									status: false,
									message: "Error retrieving user 3",
									data: {}
								} );
							} );
						}

						// LOGIN via Employee HRIS
						else {
							var data_hris = data;
							userAuth.findOne( { 
								EMPLOYEE_NIK: data_hris.EMPLOYEE_NIK
							} ).then( data_auth => {
								if ( !data_auth ) {
									return res.send({
										status: false,
										message: "User tersebut belum terdaftar (@HRIS)",
										data: {}
									});
								}

								var claims = {
									USERNAME: req.body.username,
									USER_AUTH_CODE: data_auth.USER_AUTH_CODE,
									USER_ROLE: data_auth.USER_ROLE,
									LOCATION_CODE: data_auth.LOCATION_CODE,
									REFFERENCE_ROLE: data_auth.REF_ROLE,
									EMPLOYEE_NIK: data_auth.EMPLOYEE_NIK,
									IMEI: req.body.imei
								}
								var token = tokenLib.generateToken( claims );

								var login_request = {
									USER_AUTH_CODE: data_auth.USER_AUTH_CODE,
									EMPLOYEE_NIK: data_hris.EMPLOYEE_NIK,
									USERNAME: data_hris.EMPLOYEE_USERNAME,
									ACCESS_TOKEN: token,
									LOG_LOGIN: '',
									IMEI: req.body.imei,
									INSERT_USER: '',
									INSERT_TIME: '',
									UPDATE_USER: data_hris.EMPLOYEE_USERNAME,
									DELETE_USER: '',
									DELETE_TIME: ''
								};

								loginLib.setLogin( login_request );

								// Kondisi data ada di HRIS
								res.json({
									status: true,
									message: "Success",
									data: {
										USERNAME: data_hris.EMPLOYEE_USERNAME,
										NIK: data_hris.EMPLOYEE_NIK,
										ACCESS_TOKEN: token,
										JOB_CODE: data_hris.EMPLOYEE_POSITION,
										USER_AUTH_CODE: data_auth.USER_AUTH_CODE,
										REFFERENCE_ROLE: data_auth.REF_ROLE,
										USER_ROLE: data_auth.USER_ROLE,
										LOCATION_CODE: data_auth.LOCATION_CODE
									}
								});

							} ).catch( err => {
								if( err.kind === 'ObjectId' ) {
									return res.send({
										status: false,
										message: "Error retrieving user 4zzz",
										data: {}
									});
								}
								return res.send({
									status: false,
									message: "Error retrieving user 3zzz",
									data: {}
								} );
							} );

						}

					} ).catch( err => {
						if( err.kind === 'ObjectId' ) {
							return res.send({
								status: false,
								message: "Error retrieving user 2",
								data: {}
							});
						}
						return res.send( {
							status: false,
							message: "Error retrieving user 1",
							data: {}
						} );
					} );
					
				}
				// 2.2. Kondisi false, data tidak ada di LDAP
				else {
					res.send( {
						status: false,
						message: 'Username/Password anda salah. (LDAP Failed)',
						data: {}
					} );
				}		
			} )
			.on( 'requestTimeout', function ( req ) {
				//req.abort();
				res.send( {
					status: false,
					message: 'Request Timeout',
					data: {}
				} );
			} )
			.on( 'responseTimeout', function ( res ) {
				res.send( {
					status: false,
					message: 'Response Timeout',
					data: {}
				} );
			} )
			.on( 'error', function ( err ) {
				res.send( {
					status: false,
					message: 'Error Login!',
					data: {}
				} );
			} );
		}
		else {
			res.status( 400 ).send( {
				status: false,
				message: 'Periksa input Username/Password anda.',
				data: {}
			} );
		}
	} );

	app.post( '/api/logout', verifyToken, ( req, res) => {
		nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
			if ( err ) {
				res.send({
					status: false,
					message: 'Token expired!',
					data: {}
				});
			}
			else {
				if( !req.body.user_auth_code ) {
					return res.status( 400 ).send({
						status: false,
						message: 'Invalid input',
						data: {}
					});
				}

				const loginModel = require( './app/models/login.js' );

				loginModel.findOne( { 
					USER_AUTH_CODE: req.body.user_auth_code,
					ACCESS_TOKEN: req.token,
				} ).then( data => {
					console.log( data );
					if ( !data ) {
						res.send({
							status: false,
							message: 'Access Denied, token dan auth code tidak cocok.',
							data: {}
						});
					}
					else {
						loginModel.findOneAndUpdate( { 
							USER_AUTH_CODE: req.body.user_auth_code
						}, {
							ACCESS_TOKEN: "",
							UPDATE_TIME: new Date()
						}, { new: true } )
						.then( data => {
							if( !data ) {
								return res.status( 404 ).send( {
									status: false,
									message: "Logout gagal",
									data: {}
								} );
							}
							else {
								res.send({
									status: true,
									message: 'Sukses, anda telah berhasil logout',
									data: {}
								});
							}
						}).catch( err => {
							if( err.kind === 'ObjectId' ) {
								return res.status( 404 ).send( {
									status: false,
									message: "Logout error 2",
									data: {}
								} );
							}
							return res.status( 500 ).send( {
								status: false,
								message: "Logout error",
								data: {}
							} );
						});
					}
				}).catch( err => {
					if( err.kind === 'ObjectId' ) {
						return res.status( 404 ).send( {
							status: false,
							message: "Access Denied 2",
							data: {}
						} );
					}
					return res.status( 500 ).send( {
						status: false,
						message: "Access Denied",
						data: {}
					} );
				});
			}
		} );
	} );

	// Routes
	require( './routes/route.js' )( app );
	module.exports = app;

/*
 |--------------------------------------------------------------------------
 | Token Verify
 |--------------------------------------------------------------------------
 */
	function verifyToken( req, res, next ) {
		// Get auth header value
		const bearerHeader = req.headers['authorization'];

		if ( typeof bearerHeader !== 'undefined' ) {
			const bearer = bearerHeader.split( ' ' );
			const bearerToken = bearer[1];

			req.token = bearerToken;
			next();
		}
		else {
			// Forbidden
			res.sendStatus( 403 );
		}
	}

/*
 |--------------------------------------------------------------------------
 | Set Hectare Statement
 |--------------------------------------------------------------------------
 */
function setHectareStatement() {
	var client = new Client();
	var url = config.url.microservices.masterdata_afdeling;

	if ( url_query_length > 0 ) {
		url = url + req._parsedUrl.search;
	}

	var args = {
		headers: { "Content-Type": "application/json" }
	};

	client.get( url, args, function ( data, response ) {
		// parsed response body as js object
		return { 
			"status": data.status,
			"message": data.message,
			"data": data.data
		};
	});
}


