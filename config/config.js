module.exports = {

	/*
	|--------------------------------------------------------------------------
	| App Config
	|--------------------------------------------------------------------------
	*/
	app_port: process.env.PORT || 3008,
	app_name: 'Microservice Auth',
	//app_ip: '149.129.242.205',

	/*
	|--------------------------------------------------------------------------
	| Token
	|--------------------------------------------------------------------------
	*/
	secret_key: 'T4pagri123#',
	token_expiration: 7, // Days
	token_algorithm: 'HS256',

	/*
	|--------------------------------------------------------------------------
	| URL
	|--------------------------------------------------------------------------
	*/
	url: {
		microservices: {

			inspection: 'http://localhost:3002/inspection',
			inspection_header: 'http://localhost:3002/inspection-header',
			inspection_detail: 'http://localhost:3002/inspection-detail',
			inspection_tracking: 'http://localhost:3002/inspection-tracking',

			masterdata_block: 'http://149.129.242.205:3003/block',
			masterdata_afdeling: 'http://149.129.242.205:3003/afdeling',
			masterdata_region: 'http://149.129.242.205:3003/region',

			images: 'http://149.129.242.205:3004/image',

			//finding: 'http://localhost:3005/finding',
			//finding_history: 'http://localhost:3005/finding-history',

			sync_mobile_hectare_statement: 'http://localhost:3003/sync-mobile',


			hectare_statement: 'http://149.129.242.205:3003',
			finding: 'http://localhost:3005',

			ldap: 'http://tap-ldapdev.tap-agri.com/login'
		}
	},
	
	/*
	|--------------------------------------------------------------------------
	| Error Message
	|--------------------------------------------------------------------------
	*/
	error_message: {
		invalid_token: 'Token expired! ',
		create_200: 'Success! ',
		create_403: 'Forbidden ',
		create_404: 'Error! Data gagal diproses ',
		create_500: 'Error! Terjadi kesalahan dalam pembuatan data ',
		find_200: 'Success! ',
		find_403: 'Forbidden ',
		find_404: 'Error! Tidak ada data yang ditemukan ',
		find_500: 'Error! Terjadi kesalahan dalam penampilan data ',
	}


}