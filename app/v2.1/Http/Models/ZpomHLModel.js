werks,
lgort,
holiday_date,
country,
TYPE,
hbsr,
holiday_description,
created_by,
created_date,
updated_by,
updated_date,
insert_staging

/*
 |--------------------------------------------------------------------------
 | Models - Parameter
 |--------------------------------------------------------------------------
 */
const Mongoose = require('mongoose');
const ZpomHL = Mongoose.Schema({
	WERKS: String,
	LGORT: String,
	HOLIDAY_DATE: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	},
	COUNTRY: Number,
	TYPE: String,
	HBSR: String,
	HOLIDAY_DESCRIPTION: String,
	CREATED_BY: String,
	CREATED_DATE: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	},
	UPDATE_BY: String,
	UPDATE_DATE: {
		type: Date,
		default: function () {
			return null;
		}
	},
	INSERT_STAGING: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	}
});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = Mongoose.model('ZPOM_HL_v_2_1', ZpomHL, 'TM_ZPOM_HL');