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

// FindTest
exports.findRegion = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {

			var auth = jwtDecode( req.token );
			var date_now = moment( new Date() ).format( "YYYY-MM-DD" );
			var parent_ms = 'hectare-statement';
			var target_ms = 'region';
			var url = config.url.microservices.sync_mobile_hectare_statement + '/' + target_ms + '/';
			


			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE + 'AA',
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/region'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}

				if ( data.length > 0 ) {
					// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
					var dt = data[0];
					var date_last_sync = moment( dt.TGL_MOBILE_SYNC ).format( "YYYY-MM-DD" );
					var start_time = moment( date_last_sync, "YYYY-MM-DD" ).startOf( 'day' );
					var end_time = moment( date_now, "YYYY-MM-DD" ).endOf( 'day' );

					if ( start_time != end_time ) {
						// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
						var client = new Client();
						var args = {
							headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
						};
						var url_final = url + moment( start_time ).format( "YYYY-MM-DD" ) + '/' + moment( end_time ).format( "YYYY-MM-DD" );
						client.get( url_final, args, function ( data, response ) {
							res.json( {
								status: data.status,
								message: data.message,
								data: data.data
							} );
						});
					}
					else {
						// Tidak perlu lagi sync karena sudah dilakukan pada tanggal saat ini
						res.send( {
							status: false,
							message: "Sudah melakukan sync pada tanggal " + date_now,
							data: {
								insert: {},
								update: {},
								delete: {}
							}
						} );
					}
				}
				else {
					// Tidak ada data yang ditemukan, baru pertama kali sync
					var url = config.url.microservices.masterdata_region;
					var client = new Client();
					var args = {
						headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
					};

					client.get( url, args, function (data, response) {
						// parsed response body as js object
						var insert = {};
						insert = data.data
						res.json( { 
							"status": data.status,
							"message": "Pertama kali sync. " + data.message,
							"data": {
								"insert": insert,
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
		}
	} );
};

// Find 
exports.find = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var auth = jwtDecode( req.token );

			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE
			} )
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				res.send( {
					status: true,
					message: "Success",
					data: data
				} )
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

