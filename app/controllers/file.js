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
		res.writeHead(200, {'Content-Type': 'image/png'});
		//res.write('<html><body><img src="data:image/jpeg;base64,')
		res.write( Buffer.from( path ).toString( 'base64' ) );
		//res.end('"/></body></html>');
		
		
		/*res.json( {
			message: 'OK',
			source_type: source_type,
			filename: fServer.readFile( path )
		} );*/
	}
	else {
		res.format( {
			'text/plain': function(){
				res.send( 'File not found' );
			},
		} );
	}
	
}