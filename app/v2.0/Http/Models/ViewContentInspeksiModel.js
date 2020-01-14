/*
 |--------------------------------------------------------------------------
 | Models - View Content Inspeksi
 |--------------------------------------------------------------------------
 */
const Mongoose = require('mongoose');
const ViewContentInspeksiSchema = Mongoose.Schema({});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = Mongoose.model('ViewContentInspeksi_v_2_0', ViewContentInspeksiSchema, 'VIEW_CONTENT_INSPEKSI');