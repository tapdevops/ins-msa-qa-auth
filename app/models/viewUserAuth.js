const mongoose = require( 'mongoose' );

const ViewUserAuthSchema = mongoose.Schema( {});

module.exports = mongoose.model( 'ViewUserAuth', ViewUserAuthSchema, 'VIEW_USER_AUTH' );