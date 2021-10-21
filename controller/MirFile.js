const { model } = require('mongoose')
const MirFile = require('../model/MirFiles')
const MirSubFiles = require('../model/MirSubFiles')
var fs = require('fs');

exports.saveMirFile = (req, res) => {

    let file = new MirFile({
        name: req.body.name,
        image: req.file.path,
        })
    
    let folderId = req.params.folderId;
    file.belongsTo = folderId

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


exports.getFiledata = async (req, res, next) => {

    try {
        console.log("In get file ")
        console.log("FolderId==>", req.params.folderId)
        const folderId = req.params.folderId
        const files = await MirFile.find({ belongsTo: folderId })
        files.map((file) => {
            console.log(file._id)
        })
        res.status(200).send(files)
        res.end()
   
    } catch (e) {
        res.status(400).send(e.message)
    }
}


exports.deleteMirFile = (req, res) => {

    let fileId = req.params.fileId
    console.log(fileId)
    MirFile.deleteOne({ _id: fileId }).then((resp) => {
        MirSubFiles.deleteMany({ belongsTo: fileId }).then((data) => { }).catch(() => { })
        res.status(200).json({ message: "Deleted" })
    }).catch((err) => {
        res.status(400).json({
            error: "Can't delete"
        })
    })
}

exports.updateStatus = (req, res) => {

    MirFile.findByIdAndUpdate({ _id: req.params.fileId }, { status: "Approved" }).then((result) => {
        MirSubFiles.findByIdAndUpdate({ _id: req.body.subFileId }, { status: "Approved" }).then((result) => {
            console.log("Approved")
        }).catch((err) => {
            console.log("Error")
        })
        res.status(200).json({
            Message: "Updated"
        })
    }).catch((err) => {
        res.status(404).json({
            Error: "Error"
        })
    })
}
