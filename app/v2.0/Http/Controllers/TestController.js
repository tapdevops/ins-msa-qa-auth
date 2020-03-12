/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const Models = {
        EmployeeHRIS: require( _directory_base + '/app/v2.0/Http/Models/EmployeeHRISModel.js' )
    }
    const NodeRestClient = require( 'node-rest-client' ).Client;
	const os = require('os')
 	exports.test = async (req, res) => {
         let data = await Models.EmployeeHRIS.findOne({EMPLOYEE_NIK: "00000077"})
         console.log(data)
         return res.send({
             status: true,
             message: "Testing success!",
             data
         })
    }

    exports.getCompany = async ( req, res ) => {
       
        var url = "http://tap-ldapdev.tap-agri.com/master/company"
        var args = {
            headers: { "Content-Type": "application/json" },
            requestConfig: {
                timeout: 3000, // Request timeout in milliseconds
                noDelay: true, // Enable/disable the Nagle algorithm
                keepAlive: true, // Enable/disable keep-alive functionalityidle socket
            },
            responseConfig: {
                timeout: 10000
            }
        };
    
        
        ( new NodeRestClient() ).get( url, args, async function ( data, response ) {
            console.log(data)
            return res.send({
                status: true, 
                message: "success",
                data
            })
        })
        .on( 'requestTimeout', function ( req ) {
            return res.send( {
                status: false,
                message: 'Request Timeout',
                data: os.networkInterfaces()
            } );
        } )
        .on( 'responseTimeout', function ( res ) {
            return res.send( {
                status: false,
                message: 'Response Timeout',
                data: {}
            } );
        } )
        .on( 'error', function ( err ) {
            return res.send( {
                status: false,
                message: 'Error Login!',
                data: {}
            } );
        });
    }
    
        
