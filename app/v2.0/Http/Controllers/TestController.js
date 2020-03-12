/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	exports.test = async (req, res) => {
         console.log("Testing 1..2..3.. percobaan")
         return res.send({
             status: true,
             message: "Testing success!",
             data: []
         })
     }