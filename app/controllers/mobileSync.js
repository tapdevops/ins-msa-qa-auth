const mobileSyncModel = require( '../models/mobileSync.js' );
const querystring = require('querystring');
const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );
const Client = require('node-rest-client').Client; 
const moment_pure = require( 'moment' );
const moment = require( 'moment-timezone' );
const date = require( '../libraries/date.js' );

// Find Region
exports.findRegion = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
			var auth = jwtDecode( req.token );

			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
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
					var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYY-MM-DD' );
					var end_date = date.convert( 'now', 'YYYY-MM-DD' );
					
					if ( start_date != end_date ) {
						// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
						var client = new Client();
						var args = {
							headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
						};
						var parent_ms = 'hectare-statement';
						var target_ms = 'region';
						var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
						var url_final = url + start_date + '/' + end_date;
					
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
							message: "Sudah melakukan sync pada tanggal " + end_date,
							data: {
								delete: [],
								insert: [],
								update: []
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
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						res.json( { 
							status: data.status,
							message: "Pertama kali sync. " + data.message,
							//data: {
							//	delete: {}
							//	insert: insert,
							//	update: {}
							//}
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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
			res.send({
				status: false,
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
			var auth = jwtDecode( req.token );

			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE
			})
			.select( {
				_id: 0,
				TGL_MOBILE_SYNC: 1,
				TABEL_UPDATE: 1,
				IMEI: 1
			} )
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data error',
						data: {}
					} );
				}

				var response = [];

				data.forEach( function( result ) {
					response.push( {
						TGL_MOBILE_SYNC: date.convert( String( result.TGL_MOBILE_SYNC ), 'YYYY-MM-DD hh-mm-ss' ),
						TABEL_UPDATE: result.TABEL_UPDATE,
						IMEI: result.IMEI,
					} );
				} );

				res.send( {
					status: true,
					message: "Success",
					data: response
				} )
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId error',
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
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
			if ( !req.body.TGL_MOBILE_SYNC || !req.body.TABEL_UPDATE ) {
				return res.send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}
			
			var auth = jwtDecode( req.token );
			const set = new mobileSyncModel({
				TGL_MOBILE_SYNC: date.convert( req.body.TGL_MOBILE_SYNC, 'YYYYMMDDhhmmss' ),
				TABEL_UPDATE: req.body.TABEL_UPDATE || "",
				IMEI: auth.IMEI,
				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			});

			set.save()
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data error',
						data: {}
					} );
				}

				res.send({
					status: true,
					message: 'Success',
					data: {}
				});
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId error',
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

/*
|--------------------------------------------------------------------------
| Clear Function
|--------------------------------------------------------------------------
*/
	// Find Region
	exports.findEst = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
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
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'est';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}
			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/est';
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
						"status": data.status,
						"message": "First time sync",
						"data": {
							delete: [],
							insert: data.data,
							update: []
						}
					} );
				});
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: 'ObjectId Error',
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
		
	};

	// Find Afdeling
	exports.findAfd = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/afdeling'
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
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'afdeling';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}
			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/afdeling';
				console.log( url );
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
						"status": data.status,
						"message": "First time sync",
						"data": {
							delete: [],
							insert: data.data,
							update: []
						}
					} );
				});
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: 'ObjectId Error',
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
		
	};

	// Find Block
	exports.findBlock = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/block'
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
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'block';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}
			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/block';
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
						"status": data.status,
						"message": "First time sync",
						"data": {
							delete: [],
							insert: data.data,
							update: []
						}
					} );
				});
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: 'ObjectId Error',
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
		
	};