/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const KriteriaModel = require( '../models/kriteria.js' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * Find
 * Untuk menampilkan data kriteria
 * --------------------------------------------------------------------------
 */
	exports.find = ( req, res ) => {
		var auth = req.token;
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
			url_query.DELETE_USER = "";

		KriteriaModel.find( url_query )
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
 * Untuk membuat dan menyimpan data kriteria baru
 * --------------------------------------------------------------------------
 */
	exports.create = ( req, res ) => {
		
		var auth = req.auth;
		const set_data = new KriteriaModel( {
			KRITERIA_CODE: req.body.KRITERIA_CODE || "",
			CONTENT_LABEL_CODE: req.body.CONTENT_LABEL_CODE || "",
			VALUE: req.body.VALUE || "",
			COLOR: req.body.COLOR || "",
			GRADE: req.body.GRADE || "",
			BATAS_ATAS: req.body.BATAS_ATAS || 0,
			BATAS_BAWAH: req.body.BATAS_BAWAH || 0,
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
