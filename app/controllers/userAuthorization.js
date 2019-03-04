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
	const userAuthorizationModel = require( '../models/userAuthorization.js' );

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
/*
 |--------------------------------------------------------------------------
 | Create Or Update
 |--------------------------------------------------------------------------
 |
 | Fungsi untuk mengupdate data lama atau menambahkan data baru jika ID 
 | sudah ada.
 |
 */
exports.createOrUpdate = async ( req, res ) => {

	/*═════════════════════════════════════════════════════════════════╗
	║ Validasi Input                                                   ║
	╠══════════════════════════════════════════════════════════════════╣
	║ MODULE_CODE	   												   ║
	║ MODULE_NAME	     											   ║
	╚═════════════════════════════════════════════════════════════════*/
	if ( !req.body.MODULE_CODE ) { res.json( { status: false, message: config.error_message.invalid_request + "Module Code.", data: [] } ) }
	if ( !req.body.PARAMETER_NAME ) { res.json( { status: false, message: config.error_message.invalid_request + "Parameter Name.", data: [] } ) }

	/*═════════════════════════════════════════════════════════════════╗
	║ Set Variabel           										   ║
	╚═════════════════════════════════════════════════════════════════*/
	var auth = req.auth;
	console.log( req.body );

	/*═════════════════════════════════════════════════════════════════╗
	║ Set Variabel           										   ║
	╚═════════════════════════════════════════════════════════════════*/
	userAuthorizationModel.findOne( { 
		PARAMETER_NAME: req.body.PARAMETER_NAME,
		MODULE_CODE: req.body.MODULE_CODE
	} ).then( data => {
		if( !data ) {
			const set = new userAuthorizationModel( {
				MODULE_CODE: req.body.MODULE_CODE,
				PARAMETER_NAME: req.body.PARAMETER_NAME,
				STATUS: 1,
				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
				DELETE_USER: "",
				DELETE_TIME: 0
			} );
			
			set.save()
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
					message: config.error_message.create_200 + 'Insert.',
					data: {}
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.error_message.create_500,
					data: {}
				} );
			} );
			console.log('A');
		}
		else {
			/*═════════════════════════════════════════════════════════════════╗
			║ Ganti data status. Jika 0 maka akan menjadi 1, dan sebaliknya.   ║
			╚═════════════════════════════════════════════════════════════════*/
			
			var change_status_to = 0;
			if ( data.STATUS == 0 ) {
				change_status_to = 1;
			}
			
			userAuthorizationModel.findOneAndUpdate( { 
				PARAMETER_NAME: req.body.PARAMETER_NAME,
				MODULE_CODE: req.body.MODULE_CODE
			}, {
				STATUS: change_status_to,
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
			}, { new: true } )
			.then( dataUpdate => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: config.error_message.put_404,
						data: {}
					} );
				}
				
				res.send( {
					status: true,
					message: config.error_message.put_200 + 'Update.',
					data: {}
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.error_message.put_500,
					data: {}
				} );
			} );
			
		}
	} ).catch( err => {
		res.send( {
			status: false,
			message: config.error_message.put_500,
			data: {}
		} );
	} );
}

/*
 |--------------------------------------------------------------------------
 | Find
 |--------------------------------------------------------------------------
 |
 | Fungsi untuk mengambil data.
 | Contoh :
 | 1. api-url/ 		Mengambil seluruh data
 | 2. api-ulr?AB=C 	Mengambil data berdasarkan parameter
 |
 */
exports.find = ( req, res ) => {

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	userAuthorizationModel.find( url_query )
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