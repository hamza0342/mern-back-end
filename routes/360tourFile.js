
var express = require('express');
// var {folderById} = require("../controller/project")
const {upload} = require('../helpers/filehelper')
//const sum = require('../helpers/modelfile')
var { clientRequireSignin } = require("../controller/auth")
var {saveFile , getFiledata,deleteFile} = require("../controller/360tourfile")
var router = express.Router();


router.post("/tourFile/upload/:folderId" ,upload.single('image'),saveFile)
// router.put("/modelFile/upload/:folderId",upload.single('image'),saveFile)

router.get("/tourFile/get/:folderId" , clientRequireSignin ,getFiledata);


router.delete("/tourFile/delete/:fileId",clientRequireSignin,deleteFile);
// router.get("/folder/by/:projectId", folderByProject);
// router.get("/modelFile/get",((req,res)=>{
//     res.send("Api called")
// }));
// router.param("folderId",folderById);


module.exports = router;