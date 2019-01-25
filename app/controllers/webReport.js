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
	const ViewContentInspeksiModel = require( '../models/viewContentInspeksi.js' );
	const kriteriaModel = require( '../models/kriteria.js' );






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
 * Inspection - Content Code
 * --------------------------------------------------------------------------
 */
 	exports.findInspectionContent = async( req, res ) => {
 		var auth = req.token;
		ViewContentInspeksiModel.find({})
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: config.error_message.find_404,
					data: {}
				} );
			}
			res.send( {
				status: true,
				message: config.error_message.find_200,
				data: data
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
 * Inspection - Content Code
 * --------------------------------------------------------------------------
 */
 	exports.findInspectionKriteria = async( req, res ) => {
 		var auth = req.token;
 		var value = req.params.id;

 		if ( req.params.id ) {
			kriteriaModel.find({
				BATAS_ATAS: {
					$gte: parseFloat( value )
				},
				BATAS_BAWAH: {
					$lte: parseFloat( value )
				}
			})
			.select({
				_id: 0,
				KRITERIA_CODE: 1,
				COLOR: 1,
				GRADE: 1,
				BATAS_ATAS: 1,
				BATAS_BAWAH: 1
			})
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.error_message.find_404,
						data: {}
					} );
				}
				res.send( {
					status: true,
					message: config.error_message.find_200,
					data: data
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.error_message.find_500,
					data: {}
				} );
			} );
		}
		else {
			res.send( {
				status: false,
				message: config.error_message.find_404,
				data: {}
			} );
		}
 	};

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
	exports.findingInspectionReport = async ( req, res ) => {
		url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		var client = new Client();
		var url = config.url.microservices.inspection + '/inspection-report/q';

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