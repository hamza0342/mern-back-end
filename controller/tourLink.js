const { Exposure } = require('@material-ui/icons')
const { model } = require('mongoose')
const tourLink = require('../model/tourlink')


exports.saveLink = (req,res) =>{
    console.log("In tourLink Controller")
    console.log("johojoi"+req.body)
    console.log(req.body.name)
    console.log(req.params.folderId)
    let link = new tourLink({
        link :  req.body.name,
    })
    console.log("Creating link ", req.body)
    let folderId = req.params.folderId; 
    console.log(folderId)
    link.belongsTo = folderId

    link.save((err,result)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.status(200).json({
            folder:result
        })
    })

}

exports.getLink = (req,res)=>{
    console.log("get tour link by folder id")

    tourLink.find({belongsTo :req.params.folderId}).exec()
    .then((data)=>{
        res.status(200).json({
            link : data
        })
    }).cath((err)=>{
        res.status(400).json({
            error  : err.message
        })
    })


}
