const Client = require('node-rest-client').Client; 				// Import REST Client
const config = require( '../../config/config.js' );
let jwt = require( 'jsonwebtoken' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );

// AFDELING - FIND
exports.afdelingFind = async ( req, res ) => {
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_afdeling;

			if ( url_query_length > 0 ) {
				url = url + req._parsedUrl.search;
			}
			
			var args = {
				headers: { "Content-Type": "application/json" }
			};

			client.get( url, args, function (data, response) {
				// parsed response body as js object
				res.json( { 
					"status": data.status,
					"message": data.message,
					"data": data.data
				} );
			});
		}
	} );
};

// AFDELING - CREATE
exports.afdelingCreate = async ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_afdeling;
			var args = {
				data: req.body,
				headers: { "Content-Type": "application/json" }
			};

			client.post( url, args, function ( data, response ) {
				res.json( { data } );
			});
		}
	} );
}

// AFDELING - FIND ONE
exports.afdelingFindOne = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_afdeling + '/' + req.params.id;
			var args = {
				headers: { "Content-Type": "application/json" }
			};

			client.get( url, args, function (data, response) {
				res.json( { data } );
			});
		}
	} );
}

// AFDELING - FIND ONE
exports.afdelingUpdate = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_afdeling + '/' + req.params.id;
			var args = {
				data: req.body,
				headers: { "Content-Type": "application/json" }
			};

			client.put( url, args, function ( data, response ) {
				res.json( { data } );
			});
		}
	} );
}

// AFDELING - DELETE
exports.afdelingDelete = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_afdeling + '/' + req.params.id;
			var args = {
				headers: { "Content-Type": "application/json" }
			};

			console.log( req );
			client.delete( url, args, function (data, response) {
				res.json( { data } );
			});
		}
	} );
}

// BLOCK - FIND
exports.blockFind = async ( req, res ) => {
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_block;

			if ( url_query_length > 0 ) {
				url = url + req._parsedUrl.search;
			}

			var args = {
				headers: { "Content-Type": "application/json" }
			};

			client.get( url, args, function (data, response) {
				// parsed response body as js object
				res.json( { 
					"status": data.status,
					"message": data.message,
					"data": data.data
				} );
			});
		}
	} );
};

// BLOCK - CREATE
exports.blockCreate = async ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_block;
			var args = {
				data: req.body,
				headers: { "Content-Type": "application/json" }
			};

			client.post( url, args, function ( data, response ) {
				res.json( { data } );
			});
		}
	} );
}

// BLOCK - FIND ONE
exports.blockFindOne = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_block + '/' + req.params.id;
			var args = {
				headers: { "Content-Type": "application/json" }
			};

			client.get( url, args, function (data, response) {
				res.json( { data } );
			});
		}
	} );
}

// BLOCK - FIND ONE
exports.blockUpdate = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_block + '/' + req.params.id;
			var args = {
				data: req.body,
				headers: { "Content-Type": "application/json" }
			};

			client.put( url, args, function ( data, response ) {
				res.json( { data } );
			});
		}
	} );
}

// BLOCK - DELETE
exports.blockDelete = async ( req, res ) => { 
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var client = new Client();
			var url = config.url.microservices.masterdata_block + '/' + req.params.id;
			var args = {
				headers: { "Content-Type": "application/json" }
			};

			client.delete( url, args, function (data, response) {
				res.json( { data } );
			});
		}
	} );
}


// SKM Design Block - Find
exports.findSKMDesignBlockGeoJSON = async ( req, res ) => {
	var client = new Client();
	var url = config.url.microservices.hectare_statement + '/geom/design/block/' + req.params.id;
	var args = {
		headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
	};
	client.get( url, args, function ( data, response ) {
		// parsed response body as js object
		res.json( { 
			"status": data.status,
			"message": data.message,
			"data": data.data
		} );
	});
};