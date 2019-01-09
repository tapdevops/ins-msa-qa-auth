const Client = require('node-rest-client').Client; 				// Import REST Client
const config = require( '../../config/config.js' );
let jwt = require( 'jsonwebtoken' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );

// AFDELING - FIND
exports.find = async ( req, res ) => {
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.finding + '/finding';

			if ( url_query_length > 0 ) {
				url = url + req._parsedUrl.search;
			}
			
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			console.log()

			client.get( url, args, function (data, response) {
				// parsed response body as js object
				res.json( { data } );
			});
		}
	} );
};

// FINDING - FIND
exports.findByTokenAuthCode = async ( req, res ) => {
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
	//jwt.verify( req.token, config.secret_key, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.finding + '/finding-history';

			if ( url_query_length > 0 ) {
				url = url + req._parsedUrl.search;
			}
			
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			console.log()

			client.get( url, args, function (data, response) {
				// parsed response body as js object
				res.json( { data } );
			});
		}
	} );
};

// FINDING - CREATE
exports.create = async ( req, res ) => {
	
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.finding + '/finding';
			var args = {
				data: req.body,
				headers: { 
					"Content-Type": "application/json",
					"Authorization": req.headers.authorization
				}
			};

			client.post( url, args, function ( data, response ) {
				res.json( { data } );
			});
		}
	} );
}

// FINDING - FIND ONE
exports.findOne = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.finding + '/finding/' + req.params.id;
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			client.get( url, args, function (data, response) {
				res.json( { data } );
			});
		}
	} );
}

// FINDING - UPDATE
exports.update = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.finding + '/finding/' + req.params.id;
			var args = {
				data: req.body,
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			client.put( url, args, function ( data, response ) {
				res.json( { data } );
			});
		}
	} );
}

// FINDING - DELETE
exports.delete = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.finding + '/finding/' + req.params.id;
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			client.delete( url, args, function (data, response) {
				res.json( { data } );
			});
		}
	} );
}