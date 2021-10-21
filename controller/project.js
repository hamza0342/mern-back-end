
const _ = require('lodash')
const { isBuffer } = require('lodash')
const subContractor = require('../model/subContractor')
const Project = require('../model/project')
const teamMember = require("../model/teamMembers")
const project = require('../model/project')

exports.projectById = (req, res, next, id) => {
    console.log("In projectById")
    console.log(id)
    Project.findById(id)
        .populate("postedBy", "_id name")
        .populate("team")
        .populate('comments', 'text created')
        .populate('comments.postedBy', '_id name')
        .exec((err, project) => {
            if (err || !project) {
                return res.status(400).json({
                    error: err
                })
            }
            req.project = project
            console.log("Set project")
            console.log(project)
            console.log("Going next")
            next()
        })
}

exports.getProject = (req, res) => {
    const projects = Project.find()
        .populate("postedBy", "_id name")
        .select("_id title description created")
        .then((projects) => {
            res.json({
                projects
            })
        })
        .catch(err => console.log(err))
}

exports.createProject = (req, res) => {
    let project = new Project(req.body)
    console.log("Creating Project ", req.body)
    console.log(req.profile)
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    project.postedBy = req.profile

    project.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            project: result
        })
    })
}


exports.projectByAdmin = (req, res) => {
    Project.find({
        postedBy: req.profile._id
    })
        .populate("postedBy", "_id name")
        .populate('comments', 'text created postedBy')
        // .populate('comments.postedBy', '_id name')
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

exports.isPoster = (req, res, next) => {
    let isPoster = req.project && req.auth && req.project.postedBy._id == req.auth._id
    // console.log("req.appointment:       ", req.appointment)
    // console.log("req.auth:              ", req.auth)
    // console.log("req.appointment.postedBy._id: ", req.appointment.postedBy._id)
    // console.log("req.auth._id:                 ",req.auth._id)

    if (!isPoster) {
        return res.status(400).json({
            error: "Admin is not authorized"
        })
    }
    next()
}

exports.deleteProject = (req, res) => {
    let project = req.project
    project.remove((err, project) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Project deleted Successfully"
        })
    })
}

exports.updateProject = (req, res, next) => {
    console.log("in updateProject")
    let project = req.project
    console.log("Before update")
    console.log(project)
    console.log("body")
    console.log(req.body)
    project = _.extend(project, req.body)
    project.updated = Date.now()
    project.save(err => {
        if (err) {
            console.log("Error in update")
            return res.status(400).json({
                error: err
            })
        }
        console.log("Updated project")
        console.log(project)
        res.json(project)
    })
}

exports.singleProject = (req, res) => {
    console.log(req.body)
    return res.json(req.project)
}

// exports.comment = (req, res) => {
//     let comment = req.body.comment
//     console.log("guguyguyg",req.body.clientId)
//     comment.postedBy = req.body.clientId
//     Project.findByIdAndUpdate(

//         req.body.projectId,
//         { $push: { comments: comment } },
//         { new: true }
//     )
//         .populate("comments.postedBy", "_id name")
//         .populate("postedBy", "_id name")
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err.message
//                 });
//             } else {
//                 res.json(result);
//             }
//         })
// }
exports.uncomment = (req, res) => {
    let comment = req.body.comment

    Project.findByIdAndUpdate(
        req.body.projectId,
        { $pull: { comments: { _id: comment._id } } },
        { new: true }
    )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        })
}



exports.addSubContractor = (req, res) => {
    let member = req.body.subContractor
    Project.findByIdAndUpdate(
        req.body.projectId,
        { $push: { team: member } },
        { new: true }
    )
        .populate("team")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            } else {
                subContractor.findByIdAndUpdate(
                    req.body.subContractor,
                    {
                        $push: { projects: req.body.projectId },
                        teamMember: true
                    },
                    { new: true }
                )
                    .populate("projects")
                    .exec((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: err
                            })
                        } else {
                            res.json(result)
                        }
                    })

            }
        })
}

exports.deleteSubContractor = (req, res) => {
    let member = req.body.subContractor
    Project.findByIdAndUpdate(
        req.body.projectId,
        { $pull: { team: member } },
        { new: true }
    )
        .populate("team")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            } else {
                subContractor.findByIdAndUpdate(
                    req.body.subContractor,
                    {
                        $pull: { projects: req.body.projectId },
                        teamMember: false
                    },
                    { new: true }
                )
                    .populate("projects")
                    .exec((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: err
                            })
                        } else {
                            res.json(result)
                        }
                    })

            }
        })
}

exports.getAssignedprojects = (req, res) => {
    console.log(req.params.subId)
    Project.find(
        {
            team:
                { $all: [req.params.subId] }
        }).populate("postedBy", "_id name").select("-team").exec((err, projects) => {
            if (err) {
                res.send(err)
            } else {
                res.json(projects)
            }
        })
}




