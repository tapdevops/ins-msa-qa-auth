const mongoose = require( 'mongoose' );

const KriteriaSchema = mongoose.Schema( {
	
	KRITERIA_CODE: String,
	CONTENT_LABEL_CODE: String,
	VALUE: String,
	COLOR: String,
	GRADE: String,
	BATAS_ATAS: {
		type: Number,
		alias: 'i',
		default: function() {
			return 0;
		}
	},
	BATAS_BAWAH: {
		type: Number,
		default: function() {
			return 0;
		}
	},
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

module.exports = mongoose.model( 'Kriteria', KriteriaSchema, 'TM_KRITERIA' );