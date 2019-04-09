/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = {
		production: {
			url: 'mongodb://dbapp:dbapp123@dbapp.tap-agri.com:27017/s_auth?authSource=admin',
			ssl: false
		},
		development: {
			url: 'mongodb://s_auth:s_auth@dbappdev.tap-agri.com:4848/s_auth?authSource=s_auth',
			ssl: false
		}
	}





	