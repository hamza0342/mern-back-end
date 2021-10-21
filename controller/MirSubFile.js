const { model } = require('mongoose')
const MirSubFile = require('../model/MirSubFiles')
var fs = require('fs');

exports.saveMirSubFile = (req, res) => {
    console.log("Uploaded By ", req.body.uploadedBy)
    console.log(req.file.path)
    let file = new MirSubFile({
        text: req.body.text,
        image: req.file.path,
        uploadedBy: req.body.uploadedBy
    })
    console.log("Creating File ", req.body)
    let fileId = req.params.fileId;
    console.log(fileId)
    file.belongsTo = fileId
    file.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            file: result
        })
    })

}

exports.getMirSubFiledata = (req, res) => {
    console.log("In SubFile")
    MirSubFile.find().select("text image belongsTo _id uploadedBy").exec().then((result) => {
        res.status(200).json({
            data: result
        })
    }).catch((err) => {
        res.status(404).json({
            error: "Not Found"
        })
    })
}

exports.getApprovedFiles = (req, res) => {
    MirSubFile.find({ status: "Approved" }).exec().then((result) => {
        res.status(200).json({
            Message: result
        })
    }).catch((err) => {
        res.status(404).json({
            Error: err.message
        })
    })
}



exports.deleteMirSubFiledata = (req, res) => {
    console.log(req.params.fileId)
    MirSubFile.deleteOne({ _id: req.params.fileId }).then((result) => {
        res.status(200).json({
            message: "Deleted"
        })
    }).catch((err) => {
        res.status(404).json({
            error: "error"
        })
    })
}