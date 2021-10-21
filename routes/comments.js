var express = require('express');
var { comment,getComments,deleteComment} = require("../controller/comments")
// var { clientRequireSignin } = require("../controller/auth")
// var {createProjectValidator} = require("../validator/index")
// var {clientById, subContractorSignup} = require("../controller/client")
var router = express.Router();

router.post("/create/comment", comment)
router.get("/getcomments/by/:projectId",getComments)
router.delete("/delete/comment/:commentId",deleteComment)


module.exports = router;

// 
// 