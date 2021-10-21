var express = require('express');
const {upload} = require('../helpers/filehelper')
var { clientRequireSignin } = require("../controller/auth")
var {saveMirFile,getFiledata,deleteMirFile,updateStatus} = require("../controller/MirFile")
var {unlinkFile} = require("../helpers/unlinkFile")
var router = express.Router();

router.post("/mirFile/upload/:folderId" ,clientRequireSignin, upload.single('image'),saveMirFile)
router.get("/getMirFile/by/:folderId",clientRequireSignin,getFiledata)
router.delete("/mirFile/by/:fileId",clientRequireSignin,deleteMirFile)
router.patch("/updateStatus/:fileId",clientRequireSignin,updateStatus)



module.exports = router