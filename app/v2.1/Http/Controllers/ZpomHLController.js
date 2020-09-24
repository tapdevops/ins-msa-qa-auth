/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */ 
    const Helper = equire( _directory_base + '/app/v2.0/Http/Libraries/Helper.js' );
    const ZpomHL = equire( _directory_base + '/app/v2.0/Http/Models/ZpomHLModel.js' );
        
    exports.syncHoliday = async ( req, res ) => {
        let werks = req.body.WERKS;
        let lgort = req.body.LGORT;
        let holidayDate = req.body.HOLIDAY_DATE;
        let country = req.body.COUNTRY;
        let type = req.body.TYPE
        let hbsr = req.body.HBSR;
        let holidayDescription = req.body.HOLIDAY_DESCRIPTION;
        let createdBy = req.body.CREATED_BY;
        let createdDate = req.body.CREATED_DATE;
        let updateBy = req.body.UPDATE_BY;
        let updateDate = req.body.UPDATE_DATE;
        let insertStaging = req.body.INSERT_STAGING;

        if(!werks || !lgort || !holidayDate || !country || !type 
            || !hbsr || !updateBy || !updateDate || !insertStaging
            || !holidayDescription || !createdBy || !createdDate) {
            return res.status(400).send({
                status: false,
                message: 'Invalid parameter',
                data: []
            });
        }
        holidayDate = Helper.date_format(holidayDate, 'YYYYMMDDhhmmss');
        createdDate = Helper.date_format(createdBy, 'YYYYMMDDhhmmss');
        updateDate = Helper.date_format(updateDate, 'YYYYMMDDhhmmss');
        insertStaging = Helper.date_format(insertStaging, 'YYYYMMDDhhmmss');
        let zpomData = {
            WERKS: werks,
            HOLIDAY_DATE: holidayDate,
            LGORT: lgort,
            TYPE: type,
            HBSR: hbsr,
            HOLIDAY_DESCRIPTION: holidayDescription,
            CREATED_DATE: createdDate,
            CREATED_BY : createdBy,
            UPDATE_BY : updateBy,
            UPDATE_DATE: updateDate,
            INSERT_STAGING: insertStaging,
        }
        ZpomHL.updateOne({
            WERKS: werks,
            HOLIDAY_DATE: holidayDate,
            LGORT: lgort,
            TYPE: type,
            HBSR: hbsr
        }, zpomData, {upsert: true})
        .then(data => {
            console.log(data);
            res.status(200).send({
                status: true,
                message: 'success',
                data: []
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).send({
                status: false,
                message: 'Internal server error',
                data: []
            })
        })
    }