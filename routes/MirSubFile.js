var express = require('express');
const {upload} = require('../helpers/filehelper')
var { clientRequireSignin } = require("../controller/auth")
var {saveMirSubFile,getMirSubFiledata,deleteMirSubFiledata,getApprovedFiles} = require("../controller/MirSubFile")
var {unlinkFile} = require("../helpers/unlinkFile")
var router = express.Router();

router.post("/mirSubFile/upload/:fileId" ,clientRequireSignin, upload.single('image'),saveMirSubFile)
router.get("/getMirSubFiles" ,clientRequireSignin,getMirSubFiledata)
router.get("/getMirSubFiles/approved" ,clientRequireSignin,getApprovedFiles)
router.delete("/deleteMirSubFiles/:fileId",clientRequireSignin,deleteMirSubFiledata)



module.exports = router