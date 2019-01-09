const fServer = require( 'fs' );
exports.findImage = ( req, res ) => {
	// assets/images/category/
	var source_type = req.params.source_type;
	var filename = req.params.filename;
	var path_default = '';
	var path = '';

	switch ( source_type ) {
		case 'category':
			path_default = _directory_base + '/assets/images/category/';
			break;
	}

	path = path_default + filename;

	if ( fServer.existsSync( path ) ) {
		console.log( path );
		console.log(req.originalUrl)
	}
	else {
		res.format( {
			'text/plain': function(){
				res.send( 'File not found' );
			},
		} );
		console.log( req.protocol + '://' + req.get('host') + '/files/images/category/ic_pokok-abnormal.png' )
	}
	
}