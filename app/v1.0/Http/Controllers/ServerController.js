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
			// {
   //          "MOBILE_VERSION": "2.0",
   //          "API_NAME": "AUTH-SYNC-FINDING",
   //          "KETERANGAN": "Untuk sinkronisasi data Finding.",
   //          "METHOD": "GET",
   //          "API_URL": "http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/v1.0/mobile-sync/finding"
   //      }

   			var env = config.app.env;
   			var config_url = config.app.url[env];
        	console.log(config_url);
			var data = await Models.ServiceList.aggregate( [
				{
					"$project": {
						"_id": 0,
						"MOBILE_VERSION": 1,
						"API_NAME": 1,
						"API_URL": {
							"$concat": [ "$API_BASE_URL", "$PORT", "$API_URL_PARAMETER" ]
						},
						"METHOD": 1,
						"BODY": 1,
						"KETERANGAN": 1,
					}
				}
			] );
				
			return res.json( {
				status: true,
				message: "Success!",
				data: data
			} );
		};

 	/**
	 * Time
	 * Untuk menampilkan data category
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

