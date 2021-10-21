
const _ = require('lodash')
const { isBuffer } = require('lodash')
const subContractor = require('../model/subContractor')
const Comments = require('../model/comments')


exports.comment = (req, res) => {
    console.log("in comment")
    console.log("name ===>", req.body.name)
    console.log("Comment" , req.body.comment.text)
    let comments = new Comments()
    comments.comment =  req.body.comment.text
    comments.belongsTo = req.body.projectId
    comments.postedBy = req.body.name

    console.log(comments)
    comments.save().then((result)=>{
            res.status(200).json({
                data:result
            })
    }).catch((err)=>{
        res.status(400).json({
            error : err.message
        })
    })
}

exports.getComments = (req,res)=>{
    Comments.find({belongsTo:req.params.projectId})
    .select("comment postedBy ").then((data)=>{
                        res.status(200).json({
                            comments : data
                        })
    }).catch((err)=>{
        res.status(400).json({
            error : err.message
        })
    })
}
exports.deleteComment  = (req,res)=>{
    Comments.findByIdAndDelete({_id:req.params.commentId}).exec().then((data)=>{
        res.status(200).json({
            successful: "Comment deleted "
        })
    }).catch((err)=>{
        res.status(400).json({
            error : "Error"
        })
    })
}
// exports.uncomment = (req, res) => {
//     let comment = req.body.comment

//     comments.findByIdAndUpdate(
//         req.body.commentsId,
//         { $pull: { comments: { _id: comment._id } } },
//         { new: true }
//     )
//         .populate("comments.postedBy", "_id name")
//         .populate("postedBy", "_id name")
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             } else {
//                 res.json(result);
//             }
//         })
// }






