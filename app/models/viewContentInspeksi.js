const mongoose = require( 'mongoose' );

const ViewContentInspeksiSchema = mongoose.Schema( {});

module.exports = mongoose.model( 'ViewContentInspeksi', ViewContentInspeksiSchema, 'VIEW_CONTENT_INSPEKSI' );