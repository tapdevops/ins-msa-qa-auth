const userAuthModel = require( '../models/userAuth.js' );
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
	// Auth Data
	var auth = req.auth;

	var location_code_group = auth.LOCATION_CODE.split( ',' );
	var ref_role = auth.REFFERENCE_ROLE;
	var location_code_final = [];
	var key = [];
	var query = {};
	
	if ( ref_role != 'ALL' ) {
		location_code_group.forEach( function( data ) {
			switch ( ref_role ) {
				case 'REGION_CODE':
					location_code_final.push( data );
				break;
				case 'COMP_CODE':
					location_code_final.push( data );
				break;
				case 'AFD_CODE':
					location_code_final.push( data );
				break;
				case 'BA_CODE':
					location_code_final.push( data );
				break;
			}
		} );
	}

	switch ( ref_role ) {
		case 'REGION_CODE':
			key = ref_role;
			query[key] = location_code_final;
		break;
		case 'COMP_CODE':
			key = ref_role;
			query[key] = location_code_final;
		break;
		case 'AFD_CODE':
			key = 'WERKS_AFD_CODE';
			query[key] = location_code_final;
		break;
		case 'BA_CODE':
			key = 'WERKS';
			query[key] = location_code_final;
		break;
		case 'NATIONAL':
			key = 'NATIONAL';
			query[key] = 'NATIONAL';
		break;
	}

	res.json({
		query: query
	})
	/*
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var auth = jwtDecode( req.token );
			var find_condition = {};

			if ( auth.REFFERENCE_ROLE == 'NATIONAL' ) {
				find_condition = {
					REF_ROLE: 'NATIONAL'
				}
			}
			
			else if ( auth.REFFERENCE_ROLE == 'AFD_CODE' ) {
				find_condition = {
					REF_ROLE: 'AFD_CODE',
					LOCATION_CODE: auth.LOCATION_CODE
				}
			}
			
			else if ( auth.REFFERENCE_ROLE == 'BA_CODE' ) {
				find_condition = {
					REF_ROLE: 'AFD_CODE',
					LOCATION_CODE: auth.LOCATION_CODE
				}
			}

			userAuthModel.find( find_condition )
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
		}
	} );
	*/
};










