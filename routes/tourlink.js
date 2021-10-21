
var express = require('express');
var { clientRequireSignin } = require("../controller/auth")
var {saveLink , getLink,deleteFile} = require("../controller/tourLink")
var router = express.Router();

router.post("/tourLink/upload/:folderId" ,    saveLink)
router.get("/tourLink/get/:folderId"     ,  clientRequireSignin , getLink);
// router.delete("/tourLink/delete/:fileId" ,  clientRequireSignin , deleteFile);


module.exports = router;     