/*
 |--------------------------------------------------------------------------
 | Models - Kafka Log 
 |--------------------------------------------------------------------------
 */
const Mongoose = require('mongoose');
const KafkaLogSchema = Mongoose.Schema({
    TR_CODE: String,
    TOPIC: String,
    INSERT_TIME: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    }
});
/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = Mongoose.model('KafkaLog_v_2_0', KafkaLogSchema, 'TR_KAFKA_ERROR_LOGS');