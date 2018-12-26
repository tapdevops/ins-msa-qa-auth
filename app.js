/**
 * Microservice Auth
 *
 * @description :: Untuk mengatur microservice lainnya
 * @author      :: Ferdinand
 * @date        :: 06 November 2018
 */

require('express-group-routes'); 								// Express Group Routes
const express = require( 'express' );							// Import Express
const expressUpload = require( 'express-fileupload' );			// Import Express Fileupload
const mongoose = require( 'mongoose' );							// Import Mongoose
const bodyParser = require( 'body-parser' ); 					// Import Body Parser
const Client = require('node-rest-client').Client; 				// Import REST Client
let bcrypt = require( 'bcryptjs' ); 							// Import Bcrypt
let jwt = require( 'jsonwebtoken' ); 							// Import JSON Web Token
let bearerToken = require( 'express-bearer-token' ); 			// Import Express Bearer Token
const app = express(); 											// Define App
const config = require( './config/config.js' ); 				// Config
const dbConfig = require( './config/database.js' ); 			// Database Config
const tokenLib = require( './app/libraries/token.js' ); 		// Database Config
let db = mongoose.connection;

const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );

// Generate Documentation
require( 'express-aglio' )(app,{
	source: __dirname+ '/docs/source/index.apib',
	output: __dirname+ '/docs/html/index.html',
	aglioOptions: {
		themeCondenseNav: true,
		themeVariables: 'streak'
	}
});

// Setup Database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect( dbConfig.url, {
	useNewUrlParser: true,
	ssl: true
} ).then( () => {
	console.log( 'Successfully connected to the Database' );
} ).catch( err => {
	console.log( 'Could not connect to the Database. Exiting application.' )
} );

// Parse request of content-type - application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// Parse request of content-type - application/json
app.use( bodyParser.json() );

// Use Express Upload
app.use( expressUpload() );

// Server Running Message
app.listen( config.app_port, () => {
	var host = 'http://localhost:3001';
	var port = config.app_port;
	console.log( config.app_name + ' running on ' + config.app_port )
} );

app.get( '/', ( req, res ) => {
	res.json( { 'message': config.app_name } )
} );

// Login
app.post( '/api/logins', ( req, res ) => {

	console.log(req.body.imei);

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
			headers: { "Content-Type": "application/json" }
		};
		

			

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
	else {
		res.status( 400 ).send( {
			status: false,
			message: 'Periksa input Username/Password anda.',
			data: {}
		} );
	}
} );

// Login
app.post( '/api/login', ( req, res ) => {

	console.log(req.body.imei);

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
			headers: { "Content-Type": "application/json" }
		};
		
		// 1. Check ke LDAP
		client.post( url, args, function ( data, response ) {
			// 2.1. Kondisi data terdapat pada LDAP

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
		});
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

function setHectareStatement() {
	var client = new Client();
	var url = config.url.microservices.masterdata_afdeling;

	if ( url_query_length > 0 ) {
		url = url + req._parsedUrl.search;
	}

	var args = {
		headers: { "Content-Type": "application/json" }
	};

	client.get( url, args, function (data, response) {
		// parsed response body as js object
		return { 
			"status": data.status,
			"message": data.message,
			"data": data.data
		};
	});
}


module.exports = app;