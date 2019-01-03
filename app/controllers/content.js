/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const contentModel = require( '../models/content.js' );

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
 * Untuk menampilkan data content
 * --------------------------------------------------------------------------
 */
	exports.find = ( req, res ) => {
		var auth = req.token;
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
			url_query.DELETE_USER = "";

		contentModel.find( {} )
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
 * findOne
 * Untuk menampilkan data berdasarkan ID
 * --------------------------------------------------------------------------
 */
	exports.findOne = ( req, res ) => {
		var auth = req.token;

		contentModel.findOne( {
			DELETE_USER: "",
			CONTENT_CODE: req.params.id
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
 * Untuk membuat dan menyimpan data content baru
 * --------------------------------------------------------------------------
 */
	exports.create = ( req, res ) => {
		
		var auth = req.auth;
		const set_data = new contentModel( {
			CONTENT_CODE: req.body.CONTENT_CODE || "",
			GROUP_CATEGORY: req.body.GROUP_CATEGORY || "",
			CATEGORY: req.body.CATEGORY || "",
			CONTENT_NAME: req.body.CONTENT_NAME || "",
			CONTENT_TYPE: req.body.CONTENT_TYPE || "",
			UOM: req.body.UOM || "",
			FLAG_TYPE: req.body.FLAG_TYPE || "",
			BOBOT: req.body.BOBOT || 0,
			URUTAN: req.body.URUTAN || "",
			INSERT_USER: auth.USER_AUTH_CODE,
			INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			UPDATE_USER: auth.USER_AUTH_CODE,
			UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			DELETE_USER: "",
			DELETE_TIME: 0,
			TBM0: req.body.TBM0 || "",
			TBM1: req.body.TBM1 || "",
			TBM2: req.body.TBM2 || "",
			TBM3: req.body.TBM3 || "",
			TM: req.body.TM || ""
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
			
		contentModel.findOneAndUpdate( { 
			CONTENT_CODE : req.params.id 
		}, {
			GROUP_CATEGORY: req.body.GROUP_CATEGORY || "",
			CATEGORY: req.body.CATEGORY || "",
			CONTENT_NAME: req.body.CONTENT_NAME || "",
			CONTENT_TYPE: req.body.CONTENT_TYPE || "",
			UOM: req.body.UOM || "",
			FLAG_TYPE: req.body.FLAG_TYPE || "",
			BOBOT: req.body.BOBOT || 0,
			URUTAN: req.body.URUTAN || "",
			UPDATE_USER: auth.USER_AUTH_CODE,
			UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			TBM0: req.body.TBM0 || "",
			TBM1: req.body.TBM1 || "",
			TBM2: req.body.TBM2 || "",
			TBM3: req.body.TBM3 || "",
			TM: req.body.TM || ""
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
		contentModel.findOneAndUpdate( { 
			CONTENT_CODE : req.params.id 
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
