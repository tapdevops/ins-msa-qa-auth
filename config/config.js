module.exports = {

	/*
	|--------------------------------------------------------------------------
	| App Config
	|--------------------------------------------------------------------------
	*/
	app_port: process.env.PORT || 3001,
	app_name: 'Microservice Auth',
	app_ip: '149.129.242.205',

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
	| Microservice URL
	|--------------------------------------------------------------------------
	*/
	url: {
		microservices: {

			inspection: 'http://149.129.242.205:3002/inspection',
			inspection_header: 'http://149.129.242.205:3002/inspection-header',
			inspection_detail: 'http://149.129.242.205:3002/inspection-detail',
			inspection_tracking: 'http://149.129.242.205:3002/inspection-tracking',

			masterdata_block: 'http://149.129.242.205:3003/block',
			masterdata_afdeling: 'http://149.129.242.205:3003/afdeling',
			masterdata_region: 'http://149.129.242.205:3003/region',

			images: 'http://149.129.242.205:3004/image',

			finding: 'http://149.129.242.205:3005/finding',
			finding_history: 'http://149.129.242.205:3005/finding-history',

			sync_mobile_hectare_statement: 'http://localhost:3003/sync-mobile',



			hectare_statement: 'http://149.129.242.205:3003',

			ldap: 'http://tap-ldapdev.tap-agri.com/login'
		}
	}


}