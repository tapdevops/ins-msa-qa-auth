/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const viewUserAuthModel = require( '../models/viewUserAuth.js' );

	// Node Modules
	const querystring = require( 'querystring' );
	const url = require( 'url' );
	const jwt = require( 'jsonwebtoken' );
	const uuid = require( 'uuid' );
	const nJwt = require( 'njwt' );
	const jwtDecode = require( 'jwt-decode' );
	const Client = require( 'node-rest-client' ).Client; 
	const moment_pure = require( 'moment' );
	const moment = require( 'moment-timezone' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * find
 * Untuk mengambil data contact berdasarkan location code
 * --------------------------------------------------------------------------
 */



	exports.find = ( req, res ) => {
		// Auth Data
		var auth = req.auth;

		var location_code_group = auth.LOCATION_CODE.split( ',' );
		var ref_role = auth.REFFERENCE_ROLE;
		var location_code_final = [];
		var key = [];
		var query = {};
		var query_search = [];
		

		if ( ref_role != 'NATIONAL' ) {
			location_code_group.forEach( function( data ) {
				switch ( ref_role ) {
					case 'REGION_CODE':
						location_code_final.push( data );
					break;
					case 'COMP_CODE':
						location_code_final.push( data );
					break;
					case 'AFD_CODE':
						location_code_final.push( data );
					break;
					case 'BA_CODE':
						location_code_final.push( data );
					break;
				}
			} );

			switch ( ref_role ) {
				case 'REGION_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( {
							LOCATION_CODE_REGION: q
						} );
						query_search.push( {
							LOCATION_CODE_COMP: new RegExp( '^' + q.substr( 1, 1 ) )
						} );
						query_search.push( {
							LOCATION_CODE_BA: new RegExp( '^' + q.substr( 1, 1 ) )
						} );
						query_search.push( {
							LOCATION_CODE_AFD: new RegExp( '^' + q.substr( 1, 1 ) )
						} )
					} );
				break;
				case 'COMP_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( {
							LOCATION_CODE_COMP: q
						} );
						query_search.push( {
							LOCATION_CODE_BA: new RegExp( '^' + q.substr( 0, 2 ) )
						} );
						query_search.push( {
							LOCATION_CODE_AFD: new RegExp( '^' + q.substr( 0, 2 ) )
						} )
					} );
				break;
				case 'BA_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( {
							LOCATION_CODE_BA: q
						} );
						query_search.push( {
							LOCATION_CODE_AFD: new RegExp( '^' + q.substr( 0, 4 ) )
						} )
					} );
				break;
				case 'AFD_CODE':
					location_code_final.forEach( function( q ) {
						query_search.push( {
							LOCATION_CODE_BA: new RegExp( '^' + q.substr( 0, 4 ) )
						} );
					} );
				break;
			}

			/**
			* --------------------------------------------------------------------------
			* Check Job Code
			*
			* Note :
			* - ASISTEN_LAPANGAN hanya bisa assign ke sesama ASISTEN_LAPANGAN.
			* - ASISTEN_KEPALA hanya bisa assign ke ASISTEN_LAPANGAN sesuai USER_ROLE,
			*	 tidak bisa ke sesama ASISTEN_LAPANGAN.
			* - Selain ASISTEN_LAPANGAN dan ASISTEN_KEPALA, data tidak dimunculkan.
			* --------------------------------------------------------------------------
			**/
			//if ( auth.USER_ROLE == 'ASISTEN_KEPALA' || auth.USER_ROLE == 'ASISTEN_LAPANGAN' ) {
			
				viewUserAuthModel.find( { 

					$and : [
						{ 
							$or : query_search
						},
						{
							USER_ROLE : "ASISTEN_LAPANGAN"
						}
					]

					// Backup
					//$or: query_search
					//$or: [
					//	{ LOCATION_CODE_REGION: /^04/ },
					//	{ LOCATION_CODE_COMP: /^41/ },
					//	{ LOCATION_CODE_BA: /^4121/ },
					//	{ LOCATION_CODE_AFD: /^4121/ }
					//]
				}  )
				.select( {
					USER_AUTH_CODE: 1,
					EMPLOYEE_NIK: 1,
					USER_ROLE: 1,
					LOCATION_CODE: 1,
					REF_ROLE: 1,
					PJS_JOB: 1,
					PJS_FULLNAME: 1,
					HRIS_JOB: 1,
					HRIS_FULLNAME: 1,
					//LOCATION_CODE_NATIONAL: 1,
					//LOCATION_CODE_REGION: 1,
					//LOCATION_CODE_COMP: 1,
					//LOCATION_CODE_BA: 1,
					//LOCATION_CODE_AFD: 1
				} )
				.then( data => {
					if( !data ) {
						return res.send( {
							status: false,
							message: config.error_message.find_404,
							data: {}
						} );
					}

					var results = [];
					data.forEach( function( result ) {
						var result = Object.keys(result).map(function(k) {
							return [+k, result[k]];
						});
						result = result[3][1];
						results.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: result.LOCATION_CODE,
							REF_ROLE: result.REF_ROLE,
							JOB: ( !result.PJS_JOB ) ? result.HRIS_JOB : result.PJS_JOB,
							FULLNAME: ( !result.PJS_FULLNAME ) ? result.HRIS_FULLNAME : result.PJS_FULLNAME
						} );
					} );

					res.send( {
						status: true,
						message: config.error_message.find_200,
						data: results
					} );
				} ).catch( err => {
					res.send( {
						status: false,
						message: config.error_message.find_500 + ' - 2',
						data: []
					} );
				} );
			/*
			}
			else {
				res.send( {
					status: true,
					message: config.error_message.find_200,
					data: []
				} );
			}
			*/
		}
		else {
			res.send( {
				status: true,
				message: config.error_message.find_200,
				data: []
			} );

			/*
			Backup
			viewUserAuthModel.find({})
			.select( {
				USER_AUTH_CODE: 1,
				EMPLOYEE_NIK: 1,
				USER_ROLE: 1,
				LOCATION_CODE: 1,
				REF_ROLE: 1,
				PJS_JOB: 1,
				PJS_FULLNAME: 1,
				LOCATION_CODE_NATIONAL: 1,
				LOCATION_CODE_REGION: 1,
				LOCATION_CODE_COMP: 1,
				LOCATION_CODE_BA: 1,
				LOCATION_CODE_AFD: 1
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.error_message.find_404,
						data: {}
					} );
				}

				res.send( {
					status: true,
					message: config.error_message.find_200,
					data: data
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.error_message.find_500 + ' - 2',
					data: {}
				} );
			} );
			*/
		}
	};

