const scp2 = require( 'scp2' );
/**
 * syncMobile
 * Untuk menyediakan data mobile
 * --------------------------------------------------------------------------
 */
exports.init = ( req, res ) => {
	//const server = scp2.defaults({
	//	port: 22,
	//	host: '149.129.245.230',
	//	username: 'root',
	//	password: 'T4pagri123'
	//});
	//server.scp('root:T4pagri123@149.129.245.230:/Database-Config.txt', 'file.txt', , function(err) {
	//	if ( err ) {
	//		console.log( err )
	//	}
	//})
	
	scp2.scp( {
		host: '149.129.245.230',
		username: 'root',
		password: 'T4pagri123',
		path: '/database-config.json'
	}, './', function( err ) {
		if ( err ) {
			return res.send({
				status: false,
				message: "Error! Pengiriman file gambar ke Server Images",
				data: {},
			});
		}
		res.send( {
			status: true,
			message: 'Sukses',
			data: {}
		} );
		
	});
	//res.json( {
	//	message: "Success! Config database berhasil dirubah"
	//} );
}