const mongoose = require( 'mongoose' );

const UserAuthSchema = mongoose.Schema( {
	USER_AUTH_CODE: String,
	EMPLOYEE_NIK: String,
	USER_ROLE: String,
	REF_ROLE: String,
	LOCATION_CODE: String,
	INSERT_USER: String,
	INSERT_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return 0;
		}
	},
	UPDATE_USER: String,
	UPDATE_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return 0;
		}
	},
	DELETE_USER: String,
	DELETE_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i',
		default: function() {
			return 0;
		}
	}
});

module.exports = mongoose.model( 'UserAuth', UserAuthSchema, 'TM_USER_AUTH' );