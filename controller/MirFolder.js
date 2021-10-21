const MirFolder = require('../model/MirFolder')

exports.createMirFolder = (req, res) => {
    console.log("In Mir-Folder Controller")
    console.log(req.body)
    let folder = new MirFolder(req.body)
    console.log("Creating Folder ", req.body)
    let projectId = req.params.projectId;
    console.log(projectId)
    folder.belongsTo = projectId

    folder.save((err, result) => {
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

exports.folderByProject = (req, res) => {

    let projectId = req.params.projectId
    console.log(projectId)
    MirFolder.find({
        belongsTo: projectId
    })
        .populate("belongsTo", "title  -_id")
        .sort("_created")
        .exec((err, projects) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(projects)
        })
}


exports.deleteFolder = (req, res) => {
    let folderId = req.params.folderId
    console.log(folderId);
    MirFolder.findOne({ _id: folderId }).then((resp) => {
        console.log(resp._id)
        MirFolder.deleteOne({ _id: folderId })
            .then(() => {
                res.status(400).json(resp._id + " deleted")
            })
            .catch((err) => {
                console.log(err.message)
            })
    }).catch(() => {
        res.send("Folder doesnot exist")
    })
}
