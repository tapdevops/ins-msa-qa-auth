/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const userAuthModel = require( '../models/userAuth.js' );
	const viewUserAuthModel = require( '../models/viewUserAuth.js' );
	const employeeHRISModel = require( '../models/employeeHRIS.js' );
	const employeeSAPModel = require( '../models/employeeSAP.js' );
	const pjsModel = require( '../models/pjs.js' );

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
	const userAuthCode = require( '../libraries/userAuthCode.js' );

/**
 * Create
 * Untuk membuat data user
 * --------------------------------------------------------------------------
 */
exports.create = async ( req, res ) => {

	var auth = req.auth;
	var create_pjs = false;
	var split = String( req.body.EMPLOYEE_NIK ).split( '-' );
	var TYPE = split[0];
	var NIK = split[1];
	var USER_AUTH_CODE = 'TAC' + NIK;
	
	// Validasi EMPLOYEE_NIK

	var query_data_hris = await employeeHRISModel.find( {
		EMPLOYEE_NIK: NIK
	} );

	var query_data_sap = await employeeSAPModel.find( {
			NIK: NIK
		} )
		.select( {
			_id: 0,
			NIK: 1,
			EMPLOYEE_NAME: 1,
			JOB_CODE: 1
		} );

	var query_data_auth = await userAuthModel.find( {
		$or: [
			{ EMPLOYEE_NIK: NIK },
			{ USER_AUTH_CODE: USER_AUTH_CODE }
		]
	} );

	

	if ( query_data_auth.length > 0 ) {
		res.send( {
			status: false,
			message: "Error! User gagal dibuat, tidak dapat memasukkan USER_AUTH_CODE/NIK yang sama",
			data: []
		} );
	}
	else {

		var count_user = await userAuthModel.find().count();
		var generate_auth_code = userAuthCode.generate( count_user );
		
		if ( query_data_hris.length > 0 ) {

			data_user_auth = {
				USER_AUTH_CODE: generate_auth_code,
				EMPLOYEE_NIK: NIK,
				USER_ROLE: String( req.body.USER_ROLE ),
				LOCATION_CODE: String( req.body.LOCATION_CODE ),
				REF_ROLE: String( req.body.REF_ROLE ),

				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				DELETE_USER: "",
				DELETE_TIME: 0
			}

			const set_data = new userAuthModel( data_user_auth );

			set_data.save()
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: config.error_message.create_404,
						data: {}
					} );
				}
				
				res.send( {
					status: true,
					message: config.error_message.create_200,
					data: {}
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.error_message.create_500,
					data: {}
				} );
			} );

		}
		// Create PJS
		else {
			
			data_user_auth = {
				USER_AUTH_CODE: generate_auth_code,
				EMPLOYEE_NIK: String( req.body.EMPLOYEE_NIK ),
				USER_ROLE: String( req.body.USER_ROLE ),
				LOCATION_CODE: String( req.body.LOCATION_CODE ),
				REF_ROLE: String( req.body.REF_ROLE ),

				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				DELETE_USER: "",
				DELETE_TIME: 0
			}
			
			data_pjs = {

				EMPLOYEE_NIK: String( query_data_sap[0].NIK ),
				USERNAME: req.body.USERNAME,
				NAMA_LENGKAP: String( query_data_sap[0].EMPLOYEE_NAME ),
				JOB_CODE: String( query_data_sap[0].JOB_CODE ),

				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				DELETE_USER: "",
				DELETE_TIME: 0
			}

			const set_pjs = new pjsModel( data_pjs );
			const set_data = new userAuthModel( data_user_auth );

			set_data.save()
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: config.error_message.create_404,
						data: {}
					} );
				}
				
				set_pjs.save()
				.then( data => {
					if ( !data ) {
						return res.send( {
							status: false,
							message: config.error_message.create_404,
							data: {}
						} );
					}
					
					res.send( {
						status: true,
						message: config.error_message.create_200,
						data: {}
					} );
				} ).catch( err => {
					res.send( {
						status: false,
						message: config.error_message.create_500,
						data: {}
					} );
				} );

			} ).catch( err => {
				res.send( {
					status: false,
					message: config.error_message.create_500,
					data: {}
				} );
			} );
		}
	}
};

/**
 * Find
 * Untuk menampilkan data user
 * --------------------------------------------------------------------------
 */
exports.find = ( req, res ) => {

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	viewUserAuthModel.find( url_query )
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

			var JOB = ( !result.PJS_JOB ) ? result.HRIS_JOB : result.PJS_JOB;
			var FULLNAME = ( !result.PJS_FULLNAME ) ? result.HRIS_FULLNAME : result.PJS_FULLNAME
			if ( JOB != '' && FULLNAME != '' ) {
				results.push( {
					USER_AUTH_CODE: result.USER_AUTH_CODE,
					EMPLOYEE_NIK: result.EMPLOYEE_NIK,
					USER_ROLE: result.USER_ROLE,
					LOCATION_CODE: result.LOCATION_CODE,
					REF_ROLE: result.REF_ROLE,
					JOB: JOB,
					FULLNAME: FULLNAME
				} );
			}
		} );

		res.send( {
			status: true,
			message: config.error_message.find_200,
			data: results
		} );
	} ).catch( err => {
		res.send( {
			status: false,
			message: config.error_message.find_500,
			data: {}
		} );
	} );
};

/**
 * FindOne
 * Untuk menampilkan data berdasarkan primary key.
 * --------------------------------------------------------------------------
 */
exports.findOne = ( req, res ) => {

	viewUserAuthModel.find( {
		USER_AUTH_CODE: req.params.id
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

			var JOB = ( !result.PJS_JOB ) ? result.HRIS_JOB : result.PJS_JOB;
			var FULLNAME = ( !result.PJS_FULLNAME ) ? result.HRIS_FULLNAME : result.PJS_FULLNAME
			if ( JOB != '' && FULLNAME != '' ) {
				results.push( {
					USER_AUTH_CODE: result.USER_AUTH_CODE,
					EMPLOYEE_NIK: result.EMPLOYEE_NIK,
					USER_ROLE: result.USER_ROLE,
					LOCATION_CODE: result.LOCATION_CODE,
					REF_ROLE: result.REF_ROLE,
					JOB: JOB,
					FULLNAME: FULLNAME
				} );
			}
		} );

		res.send( {
			status: true,
			message: config.error_message.find_200,
			data: results[0]
		} );
	} ).catch( err => {
		res.send( {
			status: false,
			message: config.error_message.find_500,
			data: {}
		} );
	} );
};

/**
 * Update
 * Untuk mengupdate data berdasarkan primary key.
 * --------------------------------------------------------------------------
 */
	exports.update = ( req, res ) => {
		var auth = req.auth;
		
		userAuthModel.findOneAndUpdate( { 
			USER_AUTH_CODE : req.params.id 
		}, {
			USER_ROLE: req.body.USER_ROLE,
			REF_ROLE: req.body.REF_ROLE,
			LOCATION_CODE: req.body.LOCATION_CODE,
			UPDATE_USER: auth.USER_AUTH_CODE,
			UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			DELETE_USER: "",
			DELETE_TIME: 0
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: config.error_message.put_404,
					data: {}
				} );
			}

			res.send( {
				status: true,
				message: config.error_message.put_200,
				data: {}
			} );

		}).catch( err => {
			res.send( {
				status: false,
				message: config.error_message.put_500,
				data: {}
			} );
		});
	}