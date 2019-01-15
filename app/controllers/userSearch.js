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
	const employeeHRISModel = require( '../models/employeeHRIS.js' );
	const employeeSAPModel = require( '../models/employeeSAP.js' );

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
	const fServer = require( 'fs' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * Find
 * Untuk menampilkan data kriteria
 * --------------------------------------------------------------------------
 */
	exports.find = ( req, res ) => {

		if( !req.query.q || !req.query.type ) {
			return res.send({
				status: false,
				message: 'Invalid parameter',
				data: {}
			});
		}

		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		var q = url_query.q;
		var type = url_query.type;

		if ( type == 'SAP' ) {
			employeeSAPModel.find( { 
				EMPLOYEE_NAME: {
					$exists: true
				},
				$or: [ 
					{
						"EMPLOYEE_NIK": { 
							$regex: q 
						}
					}
				]
				
			} )
			.sort( {
				'EMPLOYEE_NAME': 1
			} )
			.select( {
				_id: 0,
				NIK: 1,
				EMPLOYEE_NIK: 1,
				EMPLOYEE_NAME: 1,
				JOB_CODE: 1,
			} )
			.limit( 20 )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
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
						NIK: result.EMPLOYEE_NIK,
						NIK_DISPLAY: result.NIK,
						NAMA_LENGKAP: result.EMPLOYEE_NAME,
						JOB_CODE: result.JOB_CODE
					} );
				} );
				res.send( {
					status: true,
					message: config.error_message.find_200,
					data: results
				} );

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
/*
{
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								UPDATE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							},
							{
								DELETE_TIME: {
									$gte: start_date,
									$lte: end_date
								}
							}
						]
					}
				]
			}*/
		else if ( type == 'HRIS' ) {
			employeeHRISModel.find( { 
				EMPLOYEE_USERNAME: {
					$exists: true
				},
				EMPLOYEE_NIK: {
					$exists: true
				},
				$and: [
					{
						"EMPLOYEE_NIK": { 
							$regex: q 
						}
					}
				]
				/*$or: [ 
					{
						"EMPLOYEE_NIK": { 
							$regex: q 
						}
					}
				]*/
				
			} )
			.sort( {
				'EMPLOYEE_NAME': 1
			} )
			.select( {
				_id: 0,
				EMPLOYEE_NIK: 1,
				EMPLOYEE_FULLNAME: 1,
				EMPLOYEE_POSITION: 1
			} )
			.limit( 20 )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				
				var results = [];
				data.forEach( function( result ) {
					var result = Object.keys( result ).map( function( k ) {
						return [+k, result[k]];
					});
					result = result[3][1];
					results.push( {
						NIK: result.EMPLOYEE_NIK,
						NIK_DISPLAY: result.EMPLOYEE_NIK,
						NAMA_LENGKAP: result.EMPLOYEE_FULLNAME,
						JOB_CODE: result.EMPLOYEE_POSITION
					} );
				} );
				
				res.send( {
					status: true,
					message: config.error_message.find_200,
					data: results
				} );

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
			res.send( {
				status: false,
				message: config.error_message.find_200 + 'Error',
				data: []
			} );
		}

	};