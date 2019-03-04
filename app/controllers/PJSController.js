/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const PJSModel = require( '../models/pjs.js' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * Create
 * Untuk membuat dan menyimpan data baru
 * --------------------------------------------------------------------------
 */
	exports.create = ( req, res ) => {
		if( !req.body.EMPLOYEE_NIK || !req.body.USERNAME ) {
			return res.status( 400 ).send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}
		var auth = req.auth;
		var pjs = new PJSModel( {
			EMPLOYEE_NIK: req.body.EMPLOYEE_NIK || "",
			USERNAME: req.body.USERNAME || "",
			NAMA_LENGKAP: req.body.NAMA_LENGKAP || "",
			JOB_CODE: req.body.JOB_CODE || "",
			INSERT_USER: auth.USER_AUTH_CODE,
			INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			UPDATE_USER: auth.USER_AUTH_CODE,
			UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			DELETE_USER: "",
			DELETE_TIME: 0
		} );

		pjs.save()
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
	};