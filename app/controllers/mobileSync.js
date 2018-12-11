const mobileSyncModel = require( '../models/mobileSync.js' );
const dateFormat = require( 'dateformat' );
var querystring = require('querystring');
var url = require( 'url' );
const date = require( '../libraries/date.js' );
const dateAndTimes = require( 'date-and-time' );
let jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );

// Find 
exports.find = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var auth = jwtDecode( req.token );
			var find_condition = {};

			res.send( {
				status: true,
				message: 'Error retrieving data',
				data: {}
			} );
		}
	} );
};

// Create
exports.create = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: 'Token expired!',
				data: {}
			});
		}
		else {
			if( !req.body.TGL_MOBILE_SYNC || !req.body.TABEL_UPDATE || !req.body.IMEI ) {
				return res.status( 400 ).send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			var auth = jwtDecode( req.token );
			const set = new mobileSyncModel({
				TGL_MOBILE_SYNC: req.body.TGL_MOBILE_SYNC || "",
				TABEL_UPDATE: req.body.TABEL_UPDATE || "",
				IMEI: req.body.IMEI || "",
				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: new Date(),
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



