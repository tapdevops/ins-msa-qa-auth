module.exports = {

	/*
	|--------------------------------------------------------------------------
	| App Config
	|--------------------------------------------------------------------------
	*/
	app_port: process.env.PORT || 3008,
	app_name: 'Microservice Auth (08-01-2019 16:26)',

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
			
			inspection_header: 'http://149.129.244.86:3010/inspection-header',
			inspection_detail: 'http://149.129.244.86:3010/inspection-detail',
			inspection_tracking: 'http://149.129.244.86:3010/inspection-tracking',

			masterdata_block: 'http://149.129.244.86:3009/block',
			masterdata_afdeling: 'http://149.129.244.86:3009/afdeling',
			masterdata_region: 'http://149.129.244.86:3009/region',

			//finding: 'http://localhost:3005/finding',
			//finding_history: 'http://localhost:3005/finding-history',

			sync_mobile_hectare_statement: 'http://149.129.244.86:3009/sync-mobile',



















			/*
			hectare_statement: 'http://149.129.244.86:3009',
			inspection: 'http://149.129.244.86:3010',
			finding: 'http://149.129.244.86:3011',
			images: 'http://149.129.244.86:3012',
			ldap: 'http://tap-ldapdev.tap-agri.com/login',
			*/

			
			hectare_statement: 'http://app.tap-agri.com/mobileinspection/ins-msa-hectarestatement',
			inspection: 'http://app.tap-agri.com/mobileinspection/ins-msa',
			finding: 'http://app.tap-agri.com/mobileinspection/ins-msa-finding',
			images: 'http://app.tap-agri.com/mobileinspection/ins-msa-images',
			ldap: 'http://tap-ldapdev.tap-agri.com/login',
			
			
			
			//hectare_statement: 'http://149.129.245.230:3009',
			//inspection: 'http://149.129.245.230:3010',
			//finding: 'http://149.129.245.230:3011',
			//images: 'http://149.129.245.230:3012',
			//ldap: 'http://tap-ldapdev.tap-agri.com/login',
			
			
			//hectare_statement: 'http://localhost:3009',
			//inspection: 'http://localhost:3010',
			//finding: 'http://localhost:3011',
			//images: 'http://localhost:3012',
			//ldap: 'http://tap-ldapdev.tap-agri.com/login',
			
			
		}
	},
	
	/*
	|--------------------------------------------------------------------------
	| Error Message
	|--------------------------------------------------------------------------
	*/
	error_message: {
		invalid_token: 'Token expired! ',
		invalid_request: 'Invalid Request! ',
		create_200: 'Success! ',
		create_403: 'Forbidden ',
		create_404: 'Error! Data gagal diproses. ',
		create_500: 'Error! Terjadi kesalahan dalam pembuatan data ',
		find_200: 'Success! ',
		find_403: 'Forbidden ',
		find_404: 'Error! Tidak ada data yang ditemukan ',
		find_500: 'Error! Terjadi kesalahan dalam penampilan data ',
		put_200: 'Success! ',
		put_403: 'Forbidden ',
		put_404: 'Error! Data gagal diupdate ',
		put_500: 'Error! Terjadi kesalahan dalam perubahan data ',
		delete_200: 'Success! ',
		delete_403: 'Forbidden ',
		delete_404: 'Error! Data gagal dihapus ',
		delete_500: 'Error! Terjadi kesalahan dalam penghapusan data ',
	}

}