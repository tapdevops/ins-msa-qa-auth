/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const ViewUserAuthModel = require( '../models/viewUserAuth.js' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * Find
 * Untuk menampilkan data
 * --------------------------------------------------------------------------
 */
exports.find = ( req, res ) => {
	// Auth Data
	var auth = req.auth;

	var location_code_group = auth.LOCATION_CODE.split( ',' );
	var ref_role = auth.REFFERENCE_ROLE;
	console.log("ABC");
	ViewUserAuthModel.find({})
	.select( {
		USER_AUTH_CODE: 1,
		EMPLOYEE_NIK: 1,
		USER_ROLE: 1,
		LOCATION_CODE: 1,
		REF_ROLE: 1,
		PJS_JOB: 1,
		PJS_FULLNAME: 1,
		HRIS_JOB: 1,
		HRIS_FULLNAME: 1
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
			var JOB = '';
			var FULLNAME = '';

			result = result[3][1];
			
			if ( result.PJS_JOB ) { JOB = result.PJS_JOB; }
			else if( result.HRIS_JOB ) { JOB = String( result.HRIS_JOB ); }
	
			if ( result.PJS_FULLNAME ) { FULLNAME = result.PJS_FULLNAME; }
			else if( result.HRIS_FULLNAME ) { FULLNAME = result.HRIS_FULLNAME; }

			var location_code = result.LOCATION_CODE + '';
			var location_code_regional = '';
			//var split_location_code = ( location_code.split( ',' ) ? location_code.split( ',' ) : location_code )
			
			var i = 0;
			location_code.split( ',' ).forEach( function( lc ) {
				var first_char = lc.substr( 0, 1 );
				if ( lc != 'ALL' ) {
					if ( i == 0 ) {
						if ( first_char != '0' ) {
							location_code_regional += '0' + lc.substr( 0, 1 );
						}
						else {
							location_code_regional += lc;
						}
					}
					else {
						if ( first_char != '0' ) {
							location_code_regional += ',0' + lc.substr( 0, 1 );
						}
						else {
							location_code_regional += ',' + lc;
						}
					}
				}
				else {
					location_code_regional = 'ALL';
				}
				i++;
			} );

			results.push( {
				USER_AUTH_CODE: result.USER_AUTH_CODE,
				EMPLOYEE_NIK: result.EMPLOYEE_NIK,
				USER_ROLE: result.USER_ROLE,
				LOCATION_CODE: String( result.LOCATION_CODE ),
				REF_ROLE: result.REF_ROLE,
				JOB: JOB,
				FULLNAME: FULLNAME,
				REGION_CODE: location_code_regional
			} );
		} );
		
		res.send( {
			status: true,
			message: config.error_message.find_200,
			data: results
		} );
	} ).catch( err => {
		console.log(err);
		res.send( {
			status: false,
			message: config.error_message.find_500 + ' - 2',
			data: []
		} );
	} );
};