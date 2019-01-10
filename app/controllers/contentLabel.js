/*
|--------------------------------------------------------------------------
| App Setup
|--------------------------------------------------------------------------
|
| Untuk menghandle models, libraries, helper, node modules, dan lain-lain
|
*/
 	// Models
	const contentLabelModel = require( '../models/contentLabel.js' );

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

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * Find
 * Untuk menampilkan seluruh data
 * --------------------------------------------------------------------------
 */
	exports.find = ( req, res ) => {

		var auth = req.token;
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
			url_query.DELETE_USER = "";

		contentLabelModel.find( url_query )
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
			console.log(data);
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
 * findOne
 * Untuk menampilkan data berdasarkan ID
 * --------------------------------------------------------------------------
 */
	exports.findOne = ( req, res ) => {

		var auth = req.token;
		contentLabelModel.findOne( {
			DELETE_USER: "",
			CONTENT_LABEL_CODE: req.params.id
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

/**
 * create
 * Untuk membuat dan menyimpan data baru
 * --------------------------------------------------------------------------
 */
	exports.create = ( req, res ) => {
		
		var auth = req.auth;
		const set_data = new contentLabelModel( {
			CONTENT_LABEL_CODE: req.body.CONTENT_LABEL_CODE || "",
			CONTENT_CODE: req.body.CONTENT_CODE || "",
			LABEL_NAME: req.body.LABEL_NAME || "",
			LABEL_ICON: req.body.LABEL_ICON || "",
			URUTAN_LABEL: req.body.URUTAN_LABEL || "",
			LABEL_SCORE: req.body.LABEL_SCORE || 0,
			WARNA_LABEL: req.body.WARNA_LABEL || "",
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

/**
 * update
 * Untuk mengubah data berdasarkan ID.
 * --------------------------------------------------------------------------
 */
	exports.update = ( req, res ) => {

		var auth = req.auth;
			
		contentLabelModel.findOneAndUpdate( { 
			CONTENT_LABEL_CODE : req.params.id 
		}, {
			CONTENT_CODE: req.body.CONTENT_CODE || "",
			LABEL_NAME: req.body.LABEL_NAME || "",
			LABEL_ICON: req.body.LABEL_ICON || "",
			URUTAN_LABEL: req.body.URUTAN_LABEL || "",
			LABEL_SCORE: req.body.LABEL_SCORE || 0,
			WARNA_LABEL: req.body.WARNA_LABEL || "",
			UPDATE_USER: auth.USER_AUTH_CODE,
			UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: config.error_message.put_404,
					data: {}
				} );
			}

			res.send( {
				status: true,
				message: config.error_message.put_200,
				data: {}
			} );
			
		}).catch( err => {
			res.send( {
				status: false,
				message: config.error_message.put_500,
				data: {}
			} );
		});
	};

/**
 * delete
 * Untuk menghapus data berdasarkan ID. Data diupdate DELETE_TIME dan DELETE_USERnya
 * --------------------------------------------------------------------------
 */
	exports.delete = ( req, res ) => {

		var auth = req.auth;
		contentLabelModel.findOneAndUpdate( { 
			CONTENT_LABEL_CODE : req.params.id 
		}, {
			DELETE_USER: auth.USER_AUTH_CODE,
			DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
			
		}, { new: true } )
		.then( data => {
			if( !data ) {
				return res.send( {
					status: false,
					message: config.error_message.delete_404,
					data: {}
				} );
			}

			res.send( {
				status: true,
				message: config.error_message.delete_200,
				data: {}
			} );

		}).catch( err => {
			res.send( {
				status: false,
				message: config.error_message.delete_500,
				data: {}
			} );
		});

	};