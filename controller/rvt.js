const rvt = require('../model/rvt')

exports.saveFile = (req, res) => {
    console.log("In rvt Controller")
    console.log(req.body.user)
    console.log(req.body.name)
    console.log(req.file.path)
    console.log(req.params.projectId)
    let file = new rvt({
        name: req.body.name,
        image: req.file.path,
        uploadedBy: req.body.user
    })
    let projectId = req.params.projectId;
    console.log(projectId)
    file.belongsTo = projectId

    file.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            folder: result
        })
    })

}

exports.getFiledata = async (req, res) => {

    console.log("In rvt Controller")
    const projectId = req.params.projectId
    console.log(projectId)
    const files = await rvt.find({ belongsTo: projectId })

    console.log(files)
    res.status(200).send(files)
    res.end()
}
exports.deleteFile = async (req, res) => {
    let fileId = req.params.fileId
    console.log(fileId)
    rvt.findOne({ _id: fileId }).then((resp) => {
        console.log(resp._id)
        rvt.deleteOne({ _id: fileId }).then((resp) => {
            res.status(400).json({ message: "Deleted" })
        }).catch((err) => {
            res.status(400).json({
                error: "Can't delete"
            })
        })

    }).catch((err) => {
        res.status(400).json({
            error: "No File found"
        })
    })

}
