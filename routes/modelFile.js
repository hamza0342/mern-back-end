var express = require('express');
const {upload} = require('../helpers/filehelper')
var { clientRequireSignin } = require("../controller/auth")
var {saveFile , getFiledata,deleteFile} = require("../controller/modelFile")
var {unlinkFile} = require("../helpers/unlinkFile")
var router = express.Router();


router.post("/modelFile/upload/:folderId" ,clientRequireSignin, upload.single('image'),saveFile)
router.get("/modelFile/get/:folderId" , clientRequireSignin ,getFiledata);
router.delete("/modelFile/delete/:fileId",clientRequireSignin,unlinkFile,deleteFile);



module.exports = router;