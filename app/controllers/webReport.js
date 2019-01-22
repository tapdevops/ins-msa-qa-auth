/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const categoryModel = require( '../models/category.js' );

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
 * Find Finding
 * --------------------------------------------------------------------------
 */
exports.findingFind = async ( req, res ) => {
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	var client = new Client();
	var url = config.url.microservices.finding + '/finding/q';

	if ( url_query_length > 0 ) {
		url = url + req._parsedUrl.search;
	}
	
	var args = {
		headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
	};

	client.get( url, args, function (data, response) {
		// parsed response body as js object
		res.json( { 
			"status": data.status,
			"message": data.message,
			"data": data.data
		} );
	});
}

/**
 * Find Inspeksi Header
 * --------------------------------------------------------------------------
 */
exports.findingInspectionH = async ( req, res ) => {
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	var client = new Client();
	var url = config.url.microservices.inspection + '/inspection-header/q';

	if ( url_query_length > 0 ) {
		url = url + req._parsedUrl.search;
	}
	
	var args = {
		headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
	};

	client.get( url, args, function (data, response) {
		// parsed response body as js object
		res.json( { 
			"status": data.status,
			"message": data.message,
			"data": data.data
		} );
	});
}