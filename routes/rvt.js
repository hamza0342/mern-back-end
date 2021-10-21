var express = require('express');
// var {folderById} = require("../controller/project")
const {upload} = require('../helpers/filehelper')
//const sum = require('../helpers/modelfile')
var { clientRequireSignin } = require("../controller/auth")
var {saveFile , getFiledata,deleteFile} = require("../controller/rvt")
var {unlinkFile} = require("../helpers/unlinkFile")
var router = express.Router();


router.post    ("/rvt/upload/:projectId"  ,  clientRequireSignin,upload.single('image'),saveFile)
router.get     ("/rvt/get/:projectId"     ,  clientRequireSignin,getFiledata);
router.delete  ("/rvt/delete/:fileId"     ,  unlinkFile,deleteFile)


module.exports = router;
