var fs = require('fs');

exports.unlinkFile = (req,res,next)=>{
        console.log("model file ===>",req.body.name)
        const path = req.body.name
        const sliced =  path.slice(8)
        fs.unlinkSync(`./uploads/${sliced}`)
        next()
}