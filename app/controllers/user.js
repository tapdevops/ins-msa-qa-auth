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

/**
 * Find
 * Untuk menampilkan data kriteria
 * --------------------------------------------------------------------------
 */
exports.create = async ( req, res ) => {

	var auth = req.auth;
	var create_pjs = false;
	var NIK = req.body.EMPLOYEE_NIK;
	var USER_AUTH_CODE = 'TAC' + NIK;

	// Validasi EMPLOYEE_NIK

	var query_data_hris = await employeeHRISModel.find( {
		EMPLOYEE_NIK: NIK
	} );

	var query_data_sap = await employeeSAPModel.find( {
			EMPLOYEE_NIK: NIK
		} )
		.select( {
			_id: 0,
			EMPLOYEE_NIK: 1,
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
			data: {}
		} );
	}
	else {
		if ( query_data_hris.length > 0 ) {

			data_user_auth = {
				USER_AUTH_CODE: String( req.body.USER_AUTH_CODE + req.body.EMPLOYEE_NIK ),
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
				USER_AUTH_CODE: String( req.body.USER_AUTH_CODE + req.body.EMPLOYEE_NIK ),
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

				EMPLOYEE_NIK: String( query_data_sap[0].EMPLOYEE_NIK ),
				USERNAME: String( query_data_sap[0].EMPLOYEE_NIK ),
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

	/*
	const set_data = new userAuthModel( {
		USER_AUTH_CODE: req.body.USER_AUTH_CODE + "_" + req.body.EMPLOYEE_NIK || "",
		EMPLOYEE_NIK: req.body.EMPLOYEE_NIK || "",
		USER_ROLE: req.body.USER_ROLE || "",
		REF_ROLE: req.body.USER_ROLE || "",
		LOCATION_CODE: req.body.LOCATION_CODE || "",

		INSERT_USER: auth.USER_AUTH_CODE,
		INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
		UPDATE_USER: auth.USER_AUTH_CODE,
		UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
		DELETE_USER: "",
		DELETE_TIME: 0
	} );

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
	} );*/
};