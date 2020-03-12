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
 	exports.test = async (req, res) => {
         let data = await Models.EmployeeHRIS.findOne({EMPLOYEE_NIK: "00000077"})
         console.log(data)
         return res.send({
             status: true,
             message: "Testing success!",
             data: []
         })
     }