/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const modulesModel = require( '../models/modules.js' );

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

	// Calon di delete
	const dateFormat = require( 'dateformat' );
	const dateAndTimes = require( 'date-and-time' );

// Create and Save new Data
exports.create = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: 'Invalid token',
				data: {}
			});
		}
		else {
			if( !req.body.MODULE_CODE || !req.body.MODULE_NAME ) {
				return res.status( 400 ).send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			var auth = jwtDecode( req.token );
			const set = new modulesModel({
				MODULE_CODE: req.body.MODULE_CODE,
				MODULE_NAME: req.body.MODULE_NAME,
				PARENT_MODULE: req.body.PARENT_MODULE,
				ITEM_NAME: req.body.ITEM_NAME,
				ICON: req.body.ICON,
				STATUS: req.body.STATUS,
				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				DELETE_USER: "",
				DELETE_TIME: 0
			});

			set.save()
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

			
		}
	} );
	
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {

		if ( err ) {
			return res.send( {
				status: false,
				message: 'Invalid Token',
				data: {}
			} );
		}

		var auth = jwtDecode( req.token );

		url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
		
		url_query.DELETE_USER = "";
		url_query.DELETE_TIME = "";

		modulesModel.find( url_query )
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
	} );

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {

		if ( err ) {
			return res.send( {
				status: false,
				message: 'Invalid Token',
				data: {}
			} );
		}

		var auth = jwtDecode( req.token );

		modulesModel.findOne( { 
			MODULE_CODE : req.params.id,
			DELETE_USER: "",
			DELETE_TIME: ""
		} ).then( data => {
			if( !data ) {
				return res.send({
					status: false,
					message: "Data not found 2 with id " + req.params.id,
					data: data,
				});
			}
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send({
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				});
			}
			return res.send({
				status: false,
				message: "Error retrieving Data with id " + req.params.id,
				data: {}
			} );
		} );
	} );
};

// Update single data with ID
exports.update = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		// Validation
		if( !req.body.MODULE_NAME ) {
			return res.send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}

		var auth = jwtDecode( req.token );
		
		modulesModel.findOneAndUpdate( { 
			MODULE_CODE : req.params.id 
		}, {
			MODULE_NAME: req.body.MODULE_NAME,
			PARENT_MODULE: req.body.PARENT_MODULE,
			ITEM_NAME: req.body.ITEM_NAME,
			ICON: req.body.ICON,
			STATUS: req.body.STATUS,
			UPDATE_USER: auth.USER_AUTH_CODE || "",
			UPDATE_TIME: new Date().getTime()
			
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				} );
			}

			res.send( {
				status: true,
				message: 'Success',
				data: {}
			} );
			
		}).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: "Data not found 2 with id " + req.params.id,
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: "Data error updating with id " + req.params.id,
				data: {}
			} );
		});
	});
};

// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {

		if ( err ) {
			return res.send( {
				status: false,
				message: 'Invalid Token',
				data: {}
			} );
		}

		var auth = jwtDecode( req.token );

		modulesModel.findOneAndUpdate( { 
			MODULE_CODE : req.params.id 
		}, {
			DELETE_USER: auth.USER_AUTH_CODE,
			DELETE_TIME: new Date().getTime()
			
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				} );
			}

			res.send( {
				status: true,
				message: 'Success',
				data: {}
			} );

		}).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send( {
					status: false,
					message: "Data not found 1 with id " + req.params.id,
					data: {}
				} );
			}
			return res.send( {
				status: false,
				message: "Could not delete data with id " + req.params.id,
				data: {}
			} );
		});
	});
};