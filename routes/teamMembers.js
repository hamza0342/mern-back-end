var express = require("express")
var {addTeammember,getTeamMembers} =  require("../controller/teamMembers")
var router = express.Router();

router.post('/teammembers/add/:projectId',addTeammember)
router.get('/getMember',getTeamMembers)
// router.get("/subContractors", allSubContractors)


module.exports=router