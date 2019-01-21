const parameterModel = require( '../models/parameter.js' );
const dateFormat = require( 'dateformat' );
var querystring = require('querystring');
var url = require( 'url' );
const date = require( '../libraries/date.js' );
const dateAndTimes = require( 'date-and-time' );
let jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	parameterModel.find( url_query ).sort( { NO_URUT: 'asc' } )
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

exports.findOneTimeTrack = ( req, res ) => {
	var auth = req.token;

	parameterModel.findOne( {
		PARAMETER_GROUP: "TIME_TRACK"
	} )
	.select( {
		_id: 0,
		INSERT_TIME: 0,
		INSERT_USER: 0,
		DELETE_TIME: 0,
		DELETE_USER: 0,
		UPDATE_TIME: 0,
		UPDATE_USER: 0,
		__v: 0
	} )
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

exports.create = ( req, res ) => {
		
	var auth = req.auth;
	const set_data = new parameterModel( {
		PARAMETER_GROUP: req.body.PARAMETER_GROUP || "",
		PARAMETER_NAME: req.body.PARAMETER_NAME || "",
		DESC: req.body.DESC || "",
		NO_URUT: req.body.NO_URUT || "",
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
	} );
	
};