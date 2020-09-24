/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Libraries
	const Libraries = {
		Helper: require( _directory_base + '/app/v2.0/Http/Libraries/Helper.js' )
	}

 	// Models
	const Models = {
		EmployeeHRIS: require( _directory_base + '/app/v2.0/Http/Models/EmployeeHRISModel.js' ),
		EmployeeSAP: require( _directory_base + '/app/v2.0/Http/Models/EmployeeSAPModel.js' ),
		ZpomHL : require( _directory_base + '/app/v2.1/Http/Models/ZpomHLModel.js' )
	}

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Sync HRIS
	 * Untuk membuat data yang belum ada di tabel atau mengupdate data yang sudah
	 * ada di tabel.
	 * --------------------------------------------------------------------------
	 */
	exports.sync_employee_hris = ( req, res ) => {
		if( !req.body.EMPLOYEE_NIK ) {
			return res.send( {
				status: false,
				message: 'Invalid input',
				data: {}
			} );
		}
		console.log(Libraries.Helper.date_format( 'now', 'YYYYMMDD' ));
		Models.EmployeeHRIS.findOne( { 
			EMPLOYEE_NIK: req.body.EMPLOYEE_NIK
		} ).then( data => {
			// Kondisi belum ada data, create baru dan insert ke Sync List
			if ( data == null ) {
				const empHRIS = new Models.EmployeeHRIS( {
					EMPLOYEE_NIK: req.body.EMPLOYEE_NIK,
					EMPLOYEE_USERNAME: req.body.EMPLOYEE_USERNAME,
					EMPLOYEE_FULLNAME: req.body.EMPLOYEE_FULLNAME,
					EMPLOYEE_POSITIONCODE: req.body.EMPLOYEE_POSITIONCODE,
					EMPLOYEE_POSITION: req.body.EMPLOYEE_POSITION,
					EMPLOYEE_EMAIL: req.body.EMPLOYEE_EMAIL,
					INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					DELETE_TIME_DW: Libraries.Helper.date_format( req.body.DELETE_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ).substr( 0, 8 ),
					EMPLOYEE_RESIGNDATE: Libraries.Helper.date_format( req.body.EMPLOYEE_RESIGNDATE, 'YYYYMMDDhhmmss' ) || 0
				} );
				
				empHRIS.save()
				.then( data => {
					return res.send({
						status: true,
						message: 'Success!',
						data: {}
					} );
				} ).catch( err => {
					return res.send( {
						status: false,
						message: 'Some error occurred while creating data',
						data: {}
					} );
				} );
			}
			// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
			else {
				// if ( data.EMPLOYEE_FULLNAME != req.body.EMPLOYEE_FULLNAME || data.EMPLOYEE_USERNAME != req.body.EMPLOYEE_USERNAME || data.EMPLOYEE_RESIGNDATE != req.body.EMPLOYEE_RESIGNDATE ) {
					Models.EmployeeHRIS.findOneAndUpdate( { 
						EMPLOYEE_NIK: req.body.EMPLOYEE_NIK
					}, {
						EMPLOYEE_USERNAME: req.body.EMPLOYEE_USERNAME,
						EMPLOYEE_FULLNAME: req.body.EMPLOYEE_FULLNAME,
						EMPLOYEE_POSITIONCODE: req.body.EMPLOYEE_POSITIONCODE,
						EMPLOYEE_POSITION: req.body.EMPLOYEE_POSITION,
						EMPLOYEE_EMAIL: req.body.EMPLOYEE_EMAIL,
						INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ),
						UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ),
						DELETE_TIME_DW: Libraries.Helper.date_format( req.body.DELETE_TIME_DW, 'YYYYMMDDhhmmss' ),
						LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						EMPLOYEE_RESIGNDATE: Libraries.Helper.date_format( req.body.EMPLOYEE_RESIGNDATE, 'YYYYMMDDhhmmss' )
					}, { new: true } )
					.then( data => {
						if( !data ) {
							return res.send( {
								status: false,
								message: "Data error updating 2",
								data: {}
							} );
						}
						else {
							return res.send( {
								status: true,
								message: 'Success',
								data: {}
							} );
						}
					} ).catch( err => {
						if( err.kind === 'ObjectId' ) {
							return res.send( {
								status: false,
								message: "Data not found 2",
								data: {}
							} );
						}
						return res.send( {
							status: false,
							message: "Data error updating",
							data: {}
						} );
					} );
				// }
				// else {
				// 	return res.send( {
				// 		status: true,
				// 		message: 'Skip Update',
				// 		data: {}
				// 	} );
				// }
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send({
					status: false,
					message: "Data not found 1",
					data: {}
				});
			}
			return res.send({
				status: false,
				message: "Error retrieving Data",
				data: {}
			} );
		} );
	};

	/**
	 * Sync SAP
	 * Untuk membuat data yang belum ada di tabel atau mengupdate data yang sudah
	 * ada di tabel.
	 * --------------------------------------------------------------------------
	 */
	exports.sync_employee_sap = ( req, res ) => {
		console.log("SAP");
		if( !req.body.NIK ) {
			return res.send( {
				status: false,
				message: 'Invalid input',
				data: {}
			} );
		}

		Models.EmployeeSAP.findOne( { 
			NIK: req.body.NIK
		} ).then( data => {
			// Kondisi belum ada data, create baru dan insert ke Sync List
			if ( data == null ) {
				const empHRIS = new Models.EmployeeSAP( {
					NIK: req.body.NIK,
					EMPLOYEE_NAME: req.body.EMPLOYEE_NAME,
					JOB_CODE: req.body.JOB_CODE,
					END_VALID: Libraries.Helper.date_format( req.body.END_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
					START_VALID: Libraries.Helper.date_format( req.body.START_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
					INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDD' ).substr( 0, 8 ),
					RES_DATE: Libraries.Helper.date_format( req.body.RES_DATE, 'YYYYMMDDhhmmss' ) || 0,
				} );
				
				empHRIS.save()
				.then( data => {
					return res.send({
						status: true,
						message: 'Success!',
						data: {}
					} );
				} ).catch( err => {
					return res.send( {
						status: false,
						message: 'Some error occurred while creating data',
						data: {}
					} );
				} );
			}
			// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
			else {
				// if ( data.EMPLOYEE_NAME != req.body.EMPLOYEE_NAME || data.JOB_CODE != req.body.JOB_CODE || data.END_VALID != req.body.END_VALID || data.RES_DATE != req.body.RES_DATE ) {
					Models.EmployeeSAP.findOneAndUpdate( { 
						NIK: req.body.NIK
					}, {
						EMPLOYEE_NAME: req.body.EMPLOYEE_NAME,
						JOB_CODE: req.body.JOB_CODE,
						END_VALID: Libraries.Helper.date_format( req.body.END_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
						START_VALID: Libraries.Helper.date_format( req.body.START_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
						INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ),
						UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ),
						LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' )
					}, { new: true } )
					.then( data => {
						if( !data ) {
							return res.send( {
								status: false,
								message: "Data error updating 2",
								data: {}
							} );
						}
						else {
							return res.send( {
								status: true,
								message: 'Success',
								data: {}
							} );
						}
					} ).catch( err => {
						if( err.kind === 'ObjectId' ) {
							return res.send( {
								status: false,
								message: "Data not found 2",
								data: {}
							} );
						}
						return res.send( {
							status: false,
							message: "Data error updating",
							data: {}
						} );
					} );
				// }
				// else {
				// 	return res.send( {
				// 		status: true,
				// 		message: 'Skip Update',
				// 		data: {}
				// 	} );
				// }
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send({
					status: false,
					message: "Data not found 1",
					data: {}
				});
			}
			return res.send({
				status: false,
				message: "Error retrieving Data",
				data: {}
			} );
		} );
	};
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
        let updateBy = req.body.UPDATED_BY;
        let updateDate = req.body.UPDATED_DATE;
        let insertStaging = req.body.INSERT_STAGING;
		console.log(req.body);
        if(!werks || !lgort || !holidayDate || !country || !type 
            || !hbsr || !updateBy || !updateDate || !insertStaging
            || !holidayDescription || !createdBy || !createdDate) {
            return res.status(400).send({
                status: false,
                message: 'Invalid parameter',
                data: []
            });
        }
        holidayDate = parseInt(Libraries.Helper.date_format(holidayDate, 'YYYYMMDD').substring(0,8));
        createdDate = Libraries.Helper.date_format(createdBy, 'YYYYMMDDhhmmss');
        updateDate = Libraries.Helper.date_format(updateDate, 'YYYYMMDDhhmmss');
        insertStaging = Libraries.Helper.date_format(insertStaging, 'YYYYMMDDhhmmss');
        let zpomData = {
            WERKS: werks,
            HOLIDAY_DATE: holidayDate,
            LGORT: lgort,
            TYPE: type,
            HBSR: hbsr,
            HOLIDAY_DESCRIPTION: holidayDescription,
            CREATED_DATE: createdDate,
            CREATED_BY : createdBy,
            UPDATED_BY : updateBy,
            UPDATED_DATE: updateDate,
            INSERT_STAGING: insertStaging,
        }
        Models.ZpomHL.updateOne({
            HOLIDAY_DATE: holidayDate,
        }, zpomData, {upsert: true})
        .then(data => {
			let message;
			if(data.upserted) {
				message = 'success simpan';
			} else {
				message = 'success update';
			}
            res.status(200).send({
                status: true,
                message,
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