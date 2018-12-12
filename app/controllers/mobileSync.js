const mobileSyncModel = require( '../models/mobileSync.js' );
const dateFormat = require( 'dateformat' );
const querystring = require('querystring');
const url = require( 'url' );
const date = require( '../libraries/date.js' );
const dateAndTimes = require( 'date-and-time' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );
const Client = require('node-rest-client').Client; 
const moment = require( 'moment-timezone' );

// Find 
exports.find = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var auth = jwtDecode( req.token );
			var find_condition = {};

			res.send( {
				status: true,
				message: 'Error retrieving data',
				data: {}
			} );
		}
	} );
};

// Find Region
exports.findRegion = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var date_now = moment( new Date() ).format( "YYYY-MM-DD" );
			var parent_ms = 'hectare-statement';
			var target_ms = 'region';
			var url = config.url.microservices.sync_mobile_hectare_statement + '/' + target_ms + '/' + date_now;
			var auth = jwtDecode( req.token );
			var client = new Client();
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};
			var start_time = moment( date_now, "YYYY-MM-DD" ).startOf( 'day' );
			var end_time = moment( start_time ).endOf( 'day' );

			//console.log( moment( new Date() ).format( "YYYY-MM-DD" ) );
			console.log({
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI
			})

			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI
			} )
			.then( data => {

				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found',
						data: {}
					} );
				}

				if ( data.length > 0 ) {
					mobileSyncModel.find( {
						INSERT_USER: auth.USER_AUTH_CODE,
						TABEL_UPDATE: parent_ms + '/' + target_ms,
						IMEI: auth.IMEI,
						TGL_MOBILE_SYNC: {
							$gte: start_time.toDate(),
							$lt: end_time.toDate()
						}
					} )
					.then( data => {
						if( !data ) {
							console.log( 'A' );
							return res.send( {
								status: false,
								message: 'Data not found 2',
								data: {}
							} );
						}

						if ( data.length > 0 ) {
							res.send( {
								status: false,
								message: 'There is no data to sync',
								data: {}
							} );
						}
						else {
							client.get( url, args, function ( data, response ) {
								res.json( {
									status: true,
									message: "There are some data to sync",
									data: data.data
								} );
							});
						}
					} ).catch( err => {
						if( err.kind === 'ObjectId' ) {
							return res.send( {
								status: false,
								message: 'Data not found 1',
								data: {}
							} );
						}
						return res.send( {
							status: false,
							message: 'Error retrieving data',
							data: {}
						} );
					} );
				}
				else {
					console.log('D');
					var url = config.url.microservices.masterdata_region;

					console.log( config.url.microservices.masterdata_region );

					client.get( url, args, function (data, response) {
						// parsed response body as js object
						res.json( { 
							"status": data.status,
							"message": data.message,
							"data": {
								"insert": data.data,
								"update": {},
								"delete": {}
							}
						} );
					});
				}
				

			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'Data not found 1',
						data: {}
					} );
				}
				return res.send( {
					status: false,
					message: 'Error retrieving data',
					data: {}
				} );
			} );

			/*
			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				TABEL_UPDATE: parent_ms + '/' + target_ms,
				IMEI: auth.IMEI,
				TGL_MOBILE_SYNC: {
					$gte: start_time.toDate(),
					$lt: end_time.toDate()
				}
			} )
			.then( data => {
				if( !data ) {
					console.log( 'A' );
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}

				if ( data.length > 0 ) {
					res.send( {
						status: false,
						message: 'There is no data to sync',
						data: {}
					} );
				}
				else {
					client.get( url, args, function ( data, response ) {
						res.json( {
							status: true,
							message: "There are some data to sync",
							data: data.data
						} );
					});
				}
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'Data not found 1',
						data: {}
					} );
				}
				return res.send( {
					status: false,
					message: 'Error retrieving data',
					data: {}
				} );
			} );*/
		}
	} );
};

// Create
exports.create = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: 'Token expired!',
				data: {}
			});
		}
		else {
			if ( !req.body.TGL_MOBILE_SYNC || !req.body.TABEL_UPDATE || !req.body.IMEI ) {
				return res.status( 400 ).send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			var auth = jwtDecode( req.token );
			const set = new mobileSyncModel({
				TGL_MOBILE_SYNC: req.body.TGL_MOBILE_SYNC || "",
				TABEL_UPDATE: req.body.TABEL_UPDATE || "",
				IMEI: req.body.IMEI || "",
				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: new Date(),
			});

			set.save()
			.then( data => {
				res.send({
					status: true,
					message: 'Success',
					data: {}
				});
			} ).catch( err => {
				res.status( 500 ).send( {
					status: false,
					message: 'Some error occurred while creating data',
					data: {}
				} );
			} );
		}
	} );
	
};

