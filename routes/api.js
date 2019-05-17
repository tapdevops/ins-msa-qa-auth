/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	// Controllers
	const Controllers = {
		v_1_0: {
			Auth: require( _directory_base + '/app/v1.0/Http/Controllers/AuthController.js' ),
			Category: require( _directory_base + '/app/v1.0/Http/Controllers/CategoryController.js' ),
			Content: require( _directory_base + '/app/v1.0/Http/Controllers/ContentController.js' ),
			Kriteria: require( _directory_base + '/app/v1.0/Http/Controllers/KriteriaController.js' ),
			Module: require( _directory_base + '/app/v1.0/Http/Controllers/ModuleController.js' ),
			Parameter: require( _directory_base + '/app/v1.0/Http/Controllers/ParameterController.js' ),
			SyncMobile: require( _directory_base + '/app/v1.0/Http/Controllers/SyncMobileController.js' ),
			SyncTAP: require( _directory_base + '/app/v1.0/Http/Controllers/SyncTAPController.js' ),
			Server: require( _directory_base + '/app/v1.0/Http/Controllers/ServerController.js' ),
			User: require( _directory_base + '/app/v1.0/Http/Controllers/UserController.js' ),
			WebReport: require( _directory_base + '/app/v1.0/Http/Controllers/WebReportController.js' )
		}
	}

	// Middleware
	const Middleware = {
		v_1_0: {
			VerifyToken: require( _directory_base + '/app/v1.0/Http/Middleware/VerifyToken.js' )
		}
	}

/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	module.exports = ( app ) => {
		/*
		 |--------------------------------------------------------------------------
		 | Welcome Message
		 |--------------------------------------------------------------------------
		 */
			app.get( '/', ( req, res ) => {
				res.json( { 
					application: {
						name : config.app.name,
						port : config.app.port,
						environment : config.app.env
					} 
				} )
			} );

		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.0
		 |--------------------------------------------------------------------------
		 */
			// Auth
			app.post( '/api/v1.0/auth/login', Controllers.v_1_0.Auth.login );
			app.get( '/api/v1.0/auth/contacts', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.contacts );
			app.get( '/api/v1.0/auth/generate/token', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.generate_token );

			// Category
			app.get( '/api/v1.0/category', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Category.find );

			// Content
			app.get( '/api/v1.0/content', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find );
			app.get( '/api/v1.0/content/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find_one );
			app.get( '/api/v1.0/content-label', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find );
			app.get( '/api/v1.0/content-label/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find_one );

			// Kriteria
			app.get( '/api/v1.0/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Kriteria.find );

			// Parameter
			app.get( '/api/v1.0/parameter', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.find );
			app.get( '/api/v1.0/parameter/track', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.time_track_find_one );

			// Sync Mobile 
			app.post( '/api/v1.0/sync/mobile', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.create );
			app.post( '/api/v1.0/sync/mobile/reset', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.reset );
			app.get( '/api/v1.0/mobile-sync/finding-images', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_images_find );
			app.get( '/api/v1.0/mobile-sync/auth/contact', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.contact_find );
			app.get( '/api/v1.0/mobile-sync/finding', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_find );
			app.get( '/api/v1.0/mobile-sync/auth/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.kriteria_find );
			app.get( '/api/v1.0/mobile-sync/ebcc/kualitas', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.ebcc_kualitas_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/afdeling', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_afdeling_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/block', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_block_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/comp', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_comp_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/est', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_est_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/land-use', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_land_use_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/region', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_region_find );

			// Sync TAP
			app.post( '/api/v1.0/sync/tap/employee-hris', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_hris );
			app.post( '/api/v1.0/sync/tap/employee-sap', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_sap );

			// Server
			app.get( '/api/v1.0/server/service-list', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.service_list );
			app.get( '/api/v1.0/server/time', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.time );
			
		/*
		 |--------------------------------------------------------------------------
		 | Old API
		 |--------------------------------------------------------------------------
		 */
			// Auth
			app.post( '/api/login', Controllers.v_1_0.Auth.login );
			app.get( '/api/contacts', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.contacts );
			app.get( '/api/token/generate', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.generate_token );

			// Category
			app.get( '/api/category', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Category.find );

			// Content
			app.get( '/api/content', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find );
			app.get( '/api/content/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find_one );
			app.get( '/api/content-label', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find );
			app.get( '/api/content-label/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find_one );

			// Kriteria
			app.get( '/api/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Kriteria.find );

			// Module
			app.get( '/api/modules/by-job', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find_by_job );
			app.get( '/api/modules/by-job/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find_by_job );
			app.post( '/api/modules', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.create_or_update );
			app.get( '/api/modules', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find );
			app.get( '/api/modules/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find_one );

			// Sync Mobile
			app.post( '/api/mobile-sync', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.create );
			app.post( '/api/mobile-sync/reset', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.reset );
			app.get( '/api/mobile-sync/finding-images', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_images_find );
			app.get( '/api/mobile-sync/auth/contact', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.contact_find );
			app.get( '/api/mobile-sync/finding', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_find );
			app.get( '/api/mobile-sync/auth/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.kriteria_find );
			app.get( '/api/mobile-sync/ebcc/kualitas', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.ebcc_kualitas_find );
			app.get( '/api/mobile-sync/hectare-statement/afdeling', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_afdeling_find );
			app.get( '/api/mobile-sync/hectare-statement/block', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_block_find );
			app.get( '/api/mobile-sync/hectare-statement/comp', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_comp_find );
			app.get( '/api/mobile-sync/hectare-statement/est', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_est_find );
			app.get( '/api/mobile-sync/hectare-statement/land-use', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_land_use_find );
			app.get( '/api/mobile-sync/hectare-statement/region', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_region_find );
			
			// TAP Sync
			app.post( '/sync/employee-hris', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_hris );
			app.post( '/sync/employee-sap', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_sap );
			
			// Parameter
			app.get( '/api/parameter', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.find );
			app.get( '/api/parameter/track', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.time_track_find_one );

			// Server
			app.get( '/api/server/service-list', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.service_list );
			app.get( '/api/server/time', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.time );
			
			// User
			app.post( '/api/user-authorization', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.user_authorization_create_or_update );
			app.get( '/api/user-authorization', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.user_authorization_find );
			app.get( '/api/user', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.find );
			app.get( '/api/user/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.find_one );
			app.put( '/api/user/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.update );
			app.post( '/api/user', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.create );
			app.get( '/api/user-search', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.hris_sap_search ); // Delete
			app.get( '/api/user-search/hris-sap', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.hris_sap_search );
			app.get( '/api/user-search/user-auth', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.hris_sap_search );
	
			// Web Report
			app.get( '/api/web-report/inspection/content-code', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.WebReport.inspection_content_find );
			app.get( '/api/web-report/inspection/kriteria/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.WebReport.inspection_kriteria_find );
	}