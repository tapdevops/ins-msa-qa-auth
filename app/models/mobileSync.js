const mongoose = require( 'mongoose' );

const MobileSyncSchema = mongoose.Schema( {
	TGL_MOBILE_SYNC: {
		type: Date,
		default: function() {
			return null;
		}
	},
	TABEL_UPDATE: String,
	IMEI: String,
	INSERT_USER: String,
	INSERT_TIME: {
		type: Date,
		default: function() {
			return null;
		}
	}
});

module.exports = mongoose.model( 'MobileSync', MobileSyncSchema, 'T_MOBILE_SYNC' );