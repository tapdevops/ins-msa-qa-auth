/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Libraries
	const Libraries = {
		Helper: require( _directory_base + '/app/v1.0/Http/Libraries/Helper.js' )
	}

	// Models
	const Models = {
		ServiceList: require( _directory_base + '/app/v1.0/Http/Models/ServiceListModel.js' )
	}

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Service List
	 * Untuk menampilkan data API yang digunakan pada mobile dengan versi tertentu.
	 * --------------------------------------------------------------------------
	 */
		exports.service_list = async ( req, res ) => {
   			if ( !req.query.v ) {
   				return res.json( {
					status: true,
					message: "Versi mobile belum ditentukan.",
					data: []
				} );
   			}

   			var get_version = req.query.v.toString();
   			var env = config.app.env;
   			var config_url = config.app.url[env];
			var data = await Models.ServiceList.aggregate( [
				{
					"$project": {
						"_id": 0,
						"MOBILE_VERSION": 1,
						"API_NAME": 1,
						"METHOD": 1,
						"BODY": 1,
						"KETERANGAN": 1,
						"API_URL": {
							$switch: {
								branches: [
									{
										case: { $eq: [ "$MICROSERVICE", "AUTH" ] }, 
										then: {
											"$concat": [ config_url.microservice_auth, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "EBCC VALIDATION" ] }, 
										then: {
											"$concat": [ config_url.microservice_ebcc_validation, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "FINDING" ] }, 
										then: {
											"$concat": [ config_url.microservice_finding, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "HECTARE STATEMENT" ] }, 
										then: {
											"$concat": [ config_url.microservice_hectare_statement, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "IMAGES" ] }, 
										then: {
											"$concat": [ config_url.microservice_images, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "INSPECTION" ] }, 
										then: {
											"$concat": [ config_url.microservice_inspection, "$API_URL_PARAMETER" ]
										}
									}
								],
								default: ""
							}
						}
					}
				},
				{
					"$match": {
						"MOBILE_VERSION": get_version
					}
				}
			] );

			if ( data.length > 0 ) {
				return res.json( {
					status: true,
					message: "Success!",
					data: data
				} );
			}
			else {
				return res.json( {
					status: false,
					message: "Versi mobile tersebut tidak tersedia",
					data: []
				} );
			}
		};

 	/**
	 * Time
	 * Untuk menampilkan data jam server
	 * --------------------------------------------------------------------------
	 */
		exports.time = ( req, res ) => {
			return res.json({
				status: true,
				message: "Success!",
				data: {
					time: Libraries.Helper.date_format( 'now', 'YYYY-MM-DD hh:mm:ss' )
				}
			})
		}

