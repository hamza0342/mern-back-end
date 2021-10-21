var express = require('express');
var {projectById} = require("../controller/project")
var {createMirFolder,folderByProject , deleteFolder} = require("../controller/MirFolder")
var { clientRequireSignin } = require("../controller/auth")
var router = express.Router();



router.post("/mirFolder/new/:projectId",clientRequireSignin,createMirFolder);
router.get("/mirFolder/by/:projectId",clientRequireSignin,folderByProject);
router.delete("/mirFolder/delete/:folderId",clientRequireSignin,deleteFolder);



module.exports = router;
