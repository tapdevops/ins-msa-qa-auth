/*
|--------------------------------------------------------------------------
| App Setup
|--------------------------------------------------------------------------
|
| Untuk menghandle models, libraries, helper, node modules, dan lain-lain
|
*/
	const Client = require( 'node-rest-client' ).Client; 

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * create
 * Untuk membuat dan menyimpan data baru
 * --------------------------------------------------------------------------
 */
	exports.createDetail = async ( req, res ) => {
		
		var client = new Client();
		var url = config.url.microservices.ebcc_validation + '/ebcc/validation/detail';
		
		var args = {
			data: req.body,
			headers: { 
				"Content-Type": "application/json",
				"Authorization": req.headers.authorization
			}
		};

		client.post( url, args, function ( data, response ) {
			res.json( {
				status: data.status,
				message: data.message,
				data: data.data,
			} );
		});
		
	}

	exports.createHeader = async ( req, res ) => {
		
		var client = new Client();
		var url = config.url.microservices.ebcc_validation + '/ebcc/validation/header';
		
		var args = {
			data: req.body,
			headers: { 
				"Content-Type": "application/json",
				"Authorization": req.headers.authorization
			}
		};

		client.post( url, args, function ( data, response ) {
			res.json( {
				status: data.status,
				message: data.message,
				data: data.data,
			} );
		});
		
	}