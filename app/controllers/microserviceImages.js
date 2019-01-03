/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
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
	const fs = require( 'file-system' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * create
 * Untuk membuat dan menyimpan data baru
 * --------------------------------------------------------------------------
 */
	exports.create = async ( req, res ) => {
		
		var client = new Client();
		var url = config.url.microservices.images + '/image/description';
		
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