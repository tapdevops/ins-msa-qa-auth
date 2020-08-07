/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | aUntuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const Helper = require( _directory_base + '/app/v2.0/Http/Libraries/Helper.js' );
    const fs = require( 'fs' );
    const ebccServiceUrl = config.app.url[config.app.env].microservice_ebcc_validation;
    const findingServiceUrl = config.app.url[config.app.env].microservice_finding;
    const inspectionServiceUrl = config.app.url[config.app.env].microservice_inspection;
    const imageServiceUrl = config.app.url[config.app.env].microservice_images;
    const async = require('async');
    const axios = require('axios');

    var internalServerError = {
        errorCode: 500,
        message: 'Internal Server Error'
    }
 /*
 |--------------------------------------------------------------------------
 | Versi 1.1
 |--------------------------------------------------------------------------
 */

 /*
 |---------------------------------------------------------------------------------------------
 | Fungsi read_database digunakan untuk membaca file json berisi data transaksi
 | ( finding, ebcc detail, ebcc header, inspection header, inspection detail, inspection track, 
 | inspection genba, dan image) yang diupload melalui web. Data-data tersebut kemudian ditambahkan 
 | ke mongodb
 |---------------------------------------------------------------------------------------------
 */
    exports.read_database = async ( req, res ) => {
        if ( !req.files ) {
            return res.send( {
                status: false,
                message: 'Tentukan file .json terlebih dahulu!',
                data: []
            } );
        }
        
        let file = req.files.JSON;
        let filename = file.name;
        if ( file.name.endsWith( '.json' ) && file.mimetype === 'application/json' ) {
            async.auto({
                setupDirectory: function(callback) {
                    console.log('Setup directory...');
                    let directory;
                    directory = _directory_base + '/public/tmp/import-db-json/' + filename;
                    file.mv( directory, function( err ) {
                        if (err) {
                            callback(null, directory);
                            return;
                        }
                        callback(null, directory);
                    });
                },
                readFile: ['setupDirectory', function(directory, callback) {
                    console.log('Reading File...');
                    let results;
                    fs.readFile( directory.setupDirectory, 'utf8', function ( err, data ) {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        try {
                            results = JSON.parse( data );
                            callback(null, results);
                        } catch ( error ) {
                            console.log(error);
                            callback(internalServerError, null);
                            return;
                        }
                    } );
                }],
                mappingData: ['readFile', function(results, callback) {
                    console.log('Mapping data...');
                    let findingData = [];
                    let inspectionDetailData = [];
                    let inspectionHeaderData = [];
                    let ebccDetailData = [];
                    let ebccHeaderData = [];
                    let inspectionTrackingData = [];
                    let inspectionGenbaData = [];
                    let imageData = [];
                    async.each( results.readFile, function ( result, callbackEach ) {
                        if (result['TABLE_NAME'] === 'TR_FINDING') {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach(function ( rs ) {
                                    if(rs.STATUS_SYNC == "N") {
                                        rs.DUE_DATE = rs.DUE_DATE === "" ? undefined : parseInt( Helper.date_format( rs.DUE_DATE.substring(0, 11), 'YYYYMMDD' ) + '000000' );
                                        rs.PROGRESS = parseInt( rs.PROGRESS );
                                        rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.UPDATE_TIME = rs.UPDATE_TIME === "" ? 0 : parseInt( Helper.date_format( rs.UPDATE_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.END_TIME = rs.END_TIME === "" ? 0 : parseInt( Helper.date_format( rs.END_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.RATING_VALUE = parseInt( rs.RATING_VALUE );
                                        rs.SYNC_IMAGE = undefined;
                                        rs.STATUS_SYNC = undefined;
                                        rs.STATUS = undefined;
                                        rs.syncImage = undefined;
                                        rs.DELETE_USER = "";
                                        rs.DELETE_TIME = 0;
                                        
                                        findingData.push(rs)
                                    }
                                } );
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else if ( result['TABLE_NAME'] ===  'TM_INSPECTION_TRACK' ) {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    if (rs.STATUS_SYNC == "N") {
                                        rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.DATE_TRACK = parseInt( Helper.date_format( rs.DATE_TRACK, 'YYYYMMDDhhmmss' ) );
                                        rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                        rs.STATUS_SYNC = undefined;
                                        rs.UPDATE_TIME = 0;
                                        rs.UPDATE_USER = "";
                                        rs.DELETE_TIME = 0;
                                        rs.DELETE_USER = "";
                                        rs.STATUS_TRACK = 1;
        
                                        inspectionTrackingData.push(rs);
                                    }
                                } );
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });     
                        } else if ( result['TABLE_NAME'] === "TR_H_EBCC_VALIDATION" ) {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    if (rs.STATUS_SYNC == "N") {
                                        rs.TOTAL_JANJANG = undefined;
                                        rs.SYNC_IMAGE = undefined;
                                        rs.SYNC_DETAIL = undefined;
                                        rs.STATUS_SYNC = "Y",
                                        rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                        rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.UPDATE_TIME = 0;
                                        rs.UPDATE_USER = "";
                                        rs.DELETE_TIME = 0;
                                        rs.DELETE_USER = "";
                                        rs.syncImage = undefined,
                                        rs.syncDetail = undefined
                                        
                                        ebccHeaderData.push(rs);
                                    }
                                } );
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else if ( result['TABLE_NAME'] === 'TR_D_EBCC_VALIDATION' ) {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    if(rs.STATUS_SYNC == "N") {
                                        rs.JUMLAH = parseInt( rs.JUMLAH );
                                        rs.EBCC_VALIDATION_CODE_D = undefined;
                                        rs.UOM = undefined;
                                        rs.GROUP_KUALITAS = undefined;
                                        rs.NAMA_KUALITAS = undefined;
                                        rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                        rs.STATUS_SYNC = "Y";
                                    
                                        ebccDetailData.push(rs);
                                    }
                                } );
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else if ( result['TABLE_NAME'] === 'TR_BLOCK_INSPECTION_D' ) { 
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    if (rs.STATUS_SYNC == "N") {
                                        rs.AREAL = undefined;
                                        rs.STATUS_SYNC = "Y";
                                        rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                        rs.UPDATE_TIME = 0;
                                        rs.UPDATE_USER = "";
                                        rs.DELETE_TIME = 0;
                                        rs.DELETE_USER = "";
                                        rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        
                                        inspectionDetailData.push(rs);
                                    }
                                } );
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else if ( result['TABLE_NAME'] === 'TR_BLOCK_INSPECTION_H' ) {  
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    if (rs.STATUS_SYNC == "N") {
                                        rs.ID_INSPECTION = undefined;
                                        rs.INSPECTION_DATE = parseInt( Helper.date_format( rs.INSPECTION_DATE, 'YYYYMMDDhhmmss' ) );
                                        rs.INSPECTION_SCORE = parseInt( Helper.date_format( rs.INSPECTION_SCORE, 'YYYYMMDDhhmmss' ) );
                                        rs.STATUS_SYNC = "Y",
                                        rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                        rs.START_INSPECTION = parseInt( Helper.date_format( rs.START_INSPECTION, 'YYYYMMDDhhmmss' ) );
                                        rs.END_INSPECTION = parseInt( Helper.date_format( rs.END_INSPECTION, 'YYYYMMDDhhmmss' ) );
                                        rs.UPDATE_TIME = 0;
                                        rs.DELETE_TIME = 0;
                                        rs.UPDATE_USER = "";
                                        rs.DELETE_USER = "";
                                        rs.DISTANCE = undefined;
                                        rs.TIME = undefined;
                                        rs.inspectionType = undefined;
                                        
                                        inspectionHeaderData.push(rs);
                                    }
                                } );
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else if ( result['TABLE_NAME'] === 'TR_GENBA_INSPECTION' ) {   
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                if ( dt ) {
                                    dt.forEach( function ( result ) {
                                        let resultDataGenba = [];
                                        let genbaUser = realmListToArrayObject( result.GENBA_USER );
                                        if ( genbaUser ) {
                                            let userAuthCode = [];
                                            genbaUser.then( function ( rs ) {
                                                rs.forEach( function ( r ) {
                                                    userAuthCode.push( r.USER_AUTH_CODE );
                                                } );
                                                resultDataGenba.push( {
                                                    BLOCK_INSPECTION_CODE: result.BLOCK_INSPECTION_CODE,
                                                    GENBA_USER: userAuthCode
                                                } );
                                                resultDataGenba = resultDataGenba[0];
                                                inspectionGenbaData.push(resultDataGenba);
                                            } );
                                        }
                                    } );
                                }
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else if( result['TABLE_NAME'] === 'TR_IMAGE' ) {
                            let results = realmListToArrayObject( result['DATA'] );
                            results.then( function ( data ) {
                                let dateNow = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                let dateSubstring = dateNow.toString().substring( 0, 8 );
                                const trCodeInitial = [ 'F', 'V', 'I' ];
                                const imagePath = [ 'image-finding/' + dateSubstring, 
                                                    'image-ebcc/' + dateSubstring,
                                                    'image-inspeksi/' + dateSubstring ];
                                for ( let i = 0; i < data.length; i++ ) {
                                    if (data[i].STATUS_SYNC == "N") {
                                        for ( let j = 0; j < trCodeInitial.length; j++ ) {
                                            if ( data[i].TR_CODE.startsWith( trCodeInitial[j] ) ) {
                                                data[i].IMAGE_PATH = imagePath[j];
                                            }
                                        }
                                        data[i].MIME_TYPE = "image/jpeg";
                                        data[i].SYNC_TIME = dateNow
                                        data[i].INSERT_TIME = data[i].INSERT_TIME === "" ? "" : parseInt( Helper.date_format( data[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                        data[i].UPDATE_TIME = 0;
                                        data[i].DELETE_TIME = 0;
                                        data[i].UPDATE_USER = "";
                                        data[i].DELETE_USER = "";
                                        data[i].STATUS_SYNC = "Y";
                                        data[i].IMAGE_URL = undefined;
            
                                        let dataResult = data[i];
                                        
                                        imageData.push(dataResult);
                                    }
                                }
                                callbackEach();
                            } )
                            .catch(err => {
                                console.log(err);
                                callbackEach(internalServerError);
                                return;
                            });
                        } else {
                            callbackEach();
                        }
                    }, function(err) {
                        if (err) {
                            callback(internalServerError, null);
                            return;
                        } else {
                            let allData = {};
                            allData.finding = findingData;
                            allData.inspectionDetail = inspectionDetailData;
                            allData.inspectionHeader = inspectionHeaderData;
                            allData.inspectionGenba = inspectionGenbaData;
                            allData.image = imageData;
                            allData.inspectionTracking = inspectionTrackingData;
                            allData.ebccDetail = ebccDetailData;
                            allData.ebccHeader = ebccHeaderData;
                            
                            callback(null, allData);
                        }
                    })
                }],
                sendData: ['mappingData', function(results, callback) {
                    console.log('Sending data...');
                    let data = results.mappingData;
                    let stack = [];
                    let finding = data.finding;
                    let inspectionDetail = data.inspectionDetail;
                    let inspectionHeader = data.inspectionHeader;
                    let inspectionGenba = data.inspectionGenba;
                    let image = data.image;
                    let inspectionTracking = data.inspectionTracking;
                    let ebccDetail = data.ebccDetail;
                    let ebccHeader = data.ebccHeader;

                    let sendFindingData = function(callbackFinding) {
                        finding.forEach(function(fnd) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(findingServiceUrl + '/api/v2.1/finding', fnd, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }
                    let sendInspectionDetailData = function(callbackInspectionDetail) {
                        inspectionDetail.forEach(function(inspectionD) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(inspectionServiceUrl + '/api/v2.0/detail', inspectionD, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }
                    let sendInspectionHeaderData = function(callbackInspectionHeader) {
                        inspectionHeader.forEach(function(inspectionH) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(inspectionServiceUrl + '/api/v2.0/header', inspectionH, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }
                    let sendInspectionTrackingData = function(callbackInspectionTracking) {
                        inspectionTracking.forEach(function(inspectionT) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(inspectionServiceUrl + '/api/v2.0/tracking', inspectionT, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }
                    let sendInspectionGenbaData = function(callbackInspectionGenba) {
                        for ( let index = 0; index < inspectionGenba.length; index++ ) {
                            let dataResult = result[index];
                            let args = {
                                data: dataResult ,
                                headers: { 
                                    "Content-Type": "application/json", 
                                    "Authorization": req.headers.authorization
                                }
                            }
                            result[index].GENBA_USER = [ result[index].GENBA_USER ];
                            if ( result[index].GENBA_USER[0] !== "" ) {
                                axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                                axios.post(inspectionServiceUrl + '/api/v2.0/genba', inspectionG, {headers: { "Content-Type": "application/json" }})
                                .then(function (response) {
                                    console.log(response.data);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            }
                        }
                    }
                    let sendEbccDetailData = function(callbackEbccDetail) {
                        ebccDetail.forEach(function(ebccD) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(ebccServiceUrl + '/api/v2.1/ebcc/validation/detail', ebccD, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }
                    let sendEbccHeaderData = function(callbackEbccHeader) {
                        ebccHeader.forEach(function(ebccH) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(ebccServiceUrl + '/api/v2.1/ebcc/validation/header', ebccH, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }
                    let sendImageData = function(callbackImage) {
                        image.forEach(function(img) {
                            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
                            axios.post(imageServiceUrl + '/api/v2.0/auth/upload/image/foto-transaksi', img, {headers: { "Content-Type": "application/json" }})
                            .then(function (response) {
                                console.log(response.data);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        });
                    }

                    if (data.finding) {
                        stack.push(sendFindingData);
                        stack.push(sendInspectionDetailData);
                        stack.push(sendInspectionHeaderData);
                        stack.push(sendInspectionGenbaData);
                        stack.push(sendImageData);
                        stack.push(sendInspectionTrackingData);
                        stack.push(sendEbccDetailData);
                        stack.push(sendEbccHeaderData);
                    }
                    async.parallel(stack, function(err, result) {
                        if (err) {
                            // console.log(err);
                            callback(internalServerError, null);
                            return;
                        }
                    });
                    callback(null, 'success');
                }]
            }, function(err, results) {
                if (err) {
                    return res.status(err.errorCode).send({
                        status: false,
                        message: err.message,
                        data: []
                    })
                }
                return res.status(200).send({
                    status: true,
                    message: 'upload file success',
                    data: []
                })
            });
        } else {
            return res.send( {
                status: false,
                message: 'Upload file dengan ekstensi .json',
                data: []
            } );
        }
    }
    async function realmListToArrayObject(object){
        let temp = Object.values(object);
        return temp;
    }
    