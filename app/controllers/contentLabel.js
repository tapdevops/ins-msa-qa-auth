const contentModel = require( '../models/content.js' );
const contentLabelModel = require( '../models/contentLabel.js' );
const querystring = require('querystring');
const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );
const Client = require('node-rest-client').Client; 
const moment_pure = require( 'moment' );
const moment = require( 'moment-timezone' );
const date = require( '../libraries/date.js' );

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;

		contentModel.find( url_query )
		.select({
			_id: 0,
			CONTENT_CODE: 1,
			GROUP_CATEGORY: 1,
			CATEGORY: 1,
			CONTENT_NAME: 1,
			UOM: 1,
			FLAG_TYPE: 1,
			URUTAN: 1
		})
		
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: 'Data not found 2',
					data: {}
				} );
			}
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: 'Data not found 1',
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
};

// Create and Save new Data
exports.create = ( req, res ) => {

	if( !req.body.CATEGORY_NAME ) {
		return res.send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	const set = new contentLabelModel({
		CATEGORY_NAME: req.body.CATEGORY_NAME || "",
		ICON: req.body.CATEGORY_NAME || ""
	});

	set.save()
	.then( data => {
		res.send({
			status: true,
			message: 'Success',
			data: {}
		});
	} ).catch( err => {
		res.send( {
			status: false,
			message: 'Some error occurred while creating data',
			data: {}
		} );
	} );
	
};