var express = require("express")
var { subContractorById,
     allSubContractors, 
     getSubContractor,
      updateSubContractor , 
      deleteSubContractor,
       getProject, 
       acceptProject, 
       subByCl,
    getSubcontract } =  require("../controller/subContractor")
var {getAssignedprojects} = require('../controller/project')
var { subContractorRequireSignin, clientRequireSignin } = require("../controller/auth")
var {projectById} = require("../controller/project")


var router = express.Router();

router.get("/subContractors", allSubContractors)
router.get("/subContractor/:subContractorId", getSubContractor)
router.get("/getAssignedprojects/:subId",getAssignedprojects)
router.put("/subContractor/:subContractorId",subContractorRequireSignin, updateSubContractor)
router.delete("/subContractor/:subContractorId", subContractorRequireSignin, deleteSubContractor)
router.get("/sub/by/:clientId" , clientRequireSignin,subByCl)
router.get("/getSubcontractors/:clientId/:friendId",getSubcontract)





router.param("subContractorId", subContractorById)
router.param("projectId",projectById)

module.exports=router