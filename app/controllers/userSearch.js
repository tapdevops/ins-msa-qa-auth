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
 	exports.find = async ( req, res ) => {

		if( !req.query.q ) {
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

		var data_hris = await employeeHRISModel.find( { 
				EMPLOYEE_USERNAME: {
					$exists: true
				},
				EMPLOYEE_NIK: {
					$exists: true
				},
				$and: [
					{
						$or: [
							{
								EMPLOYEE_NIK: { 
									$regex: new RegExp( '^' + q.toUpperCase() )
								}
							},
							{
								EMPLOYEE_FULLNAME: {
									$regex: new RegExp( '^' + q.toUpperCase() )
								}
							}
						]
					}
				]
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
			.limit( 20 );

		var data_sap = await employeeSAPModel.find( { 
				EMPLOYEE_NAME: {
					$exists: true
				},
				$and: [
					{
						$or: [
							{
								EMPLOYEE_NIK: { 
									$regex: new RegExp( '^' + q.toUpperCase() )
								}
							},
							{
								EMPLOYEE_NAME: {
									$regex: new RegExp( '^' + q.toUpperCase() )
								}
							}
						]
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
			.limit( 20 );

		var results = [];

		// Loop Data HRIS
		if ( data_hris.length > 0 ) {
			data_hris.forEach( function( result ) {
				var result = Object.keys( result ).map( function( k ) {
					return [+k, result[k]];
				});
				result = result[3][1];
				results.push( {
					NIK: result.EMPLOYEE_NIK,
					NAMA_LENGKAP: result.EMPLOYEE_FULLNAME,
					JOB_CODE: result.EMPLOYEE_POSITION
				} );
			} );
		}

		// Loop Data SAP
		if ( data_sap.length > 0 ) {
			data_sap.forEach( function( result ) {
				var result = Object.keys(result).map(function(k) {
					return [+k, result[k]];
				});
				result = result[3][1];
				results.push( {
					NIK: result.NIK,
					NAMA_LENGKAP: result.EMPLOYEE_NAME,
					JOB_CODE: result.JOB_CODE
				} );
			} );
		}

		res.send( {
			status: true,
			message: config.error_message.find_200,
			data: results
		} );

	};