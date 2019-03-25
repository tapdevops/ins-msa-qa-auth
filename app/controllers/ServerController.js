/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
	// Libraries
	const DateLibraries = require( '../libraries/date.js' );

/**
 * Time
 * Untuk menampilkan data time server
 * --------------------------------------------------------------------------
 */
exports.time = ( req, res ) => {
	res.json({
		status: true,
		message: "Success!",
		data: {
			time: DateLibraries.convert( 'now', 'YYYY-MM-DD hh:mm:ss' )
		}
	})
}