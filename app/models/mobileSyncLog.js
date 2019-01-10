const mongoose = require( 'mongoose' );

const MobileSyncLogSchema = mongoose.Schema( {
	TGL_MOBILE_SYNC: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i'
	},
	TABEL_UPDATE: String,
	IMEI: String,
	INSERT_USER: String,
	INSERT_TIME: {
		type: Number,
		get: v => Math.round( v ),
		set: v => Math.round( v ),
		alias: 'i'
	}
});

module.exports = mongoose.model( 'MobileSyncLog', MobileSyncLogSchema, 'T_MOBILE_SYNC_LOG' );