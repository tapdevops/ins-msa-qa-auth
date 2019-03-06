/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
	// Libraries
	const TokenLibraries = require( '../libraries/token.js' );
	const config = require( '../../config/config.js' );

/**
 * Update
 * Untuk mengupdate data berdasarkan primary key.
 * --------------------------------------------------------------------------
 */
exports.generate = ( req, res ) => {
	var auth = req.auth;
	var claims = {
		USERNAME: auth.USERNAME,
		USER_AUTH_CODE: auth.USER_AUTH_CODE,
		USER_ROLE: auth.USER_ROLE,
		LOCATION_CODE: auth.LOCATION_CODE,
		REFFERENCE_ROLE: auth.REFFERENCE_ROLE,
		EMPLOYEE_NIK: auth.EMPLOYEE_NIK,
		IMEI: auth.IMEI
	}
	var token = TokenLibraries.generateToken( claims );
	res.json( {
		status: true,
		message: "Success! Generate token berhasil. ",
		data: token
	} );
}

/**
 * Generate Lifetime
 * Untuk generate data berdasarkan primary key.
 * --------------------------------------------------------------------------
 */
//exports.tokenLifetime = ( req, res ) => {
//	var claims = {
//		USERNAME: auth.USERNAME,
//		USER_AUTH_CODE: auth.USER_AUTH_CODE,
//		USER_ROLE: auth.USER_ROLE,
//		LOCATION_CODE: auth.LOCATION_CODE,
//		REFFERENCE_ROLE: auth.REFFERENCE_ROLE,
//		EMPLOYEE_NIK: auth.EMPLOYEE_NIK,
//		IMEI: auth.IMEI
//	};
//	var njwt = nJwt.create( claims, config.secret_key, config.token_algorithm );
//	njwt.setExpiration( new Date().getTime() + ( config.token_expiration * 24 * 60 * 60 * 1000 ) );
//
//	// Compile Token
//	var token = njwt.compact();
//}