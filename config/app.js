/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = {

		/*
		|--------------------------------------------------------------------------
		| App Config
		|--------------------------------------------------------------------------
		*/
			name: 'Microservice Auth',
			env: 'development', // production, quality_assurance, development,
			port: {
				development: process.env.PORT || 3008,
				quality_assurance: process.env.PORT || 5008,
				production: process.env.PORT || 4008,
			},

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
				development: {
					ldap: 'http://tap-ldapdev.tap-agri.com/login',
					microservice_ebcc_validation: 'http://localhost:3014',
					microservice_finding: 'http://localhost:3011',
					microservice_hectare_statement: 'http://localhost:3009',
				},
				quality_assurance: {
					ldap: 'http://tap-ldapdev.tap-agri.com/login'
				},
				production: {
					ldap: 'http://tap-ldap.tap-agri.com/login'
				}
			},

		/*
		|--------------------------------------------------------------------------
		| Path
		|--------------------------------------------------------------------------
		| Config tambahan untuk mengatur jika ada path yang tidak sesuai dengan
		| parameter URL.
		*/
			path: {
				development: '',
				quality_assurance: 'mobileinspection/ins-msa-auth',
				production: 'mobileinspection/ins-msa-auth'
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