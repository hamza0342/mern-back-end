var express = require("express")
var { clientById, 
      getEnabledClients, 
      getClient, 
      updateClient,
      deleteClient ,
      getDisabledClients,
      clientBysubcontractor,
      } =  require("../controller/client")
var { clientRequireSignin ,subContractorRequireSignin} = require("../controller/auth")
var {requireSignin,checkAuth} = require("../controller/auth")
var {subContractorByClient,teamByClient} = require("../controller/subContractor")
var router = express.Router();

router.get("/clients",checkAuth,getEnabledClients)
router.get("/getdisabledclients",checkAuth,getDisabledClients)
router.get("/client/:clientId",clientRequireSignin, getClient)
router.put("/client/:clientId",clientRequireSignin, updateClient)
router.delete("/client/:clientId", clientRequireSignin, deleteClient)
router.get("/subContractor/by/:clientId", clientRequireSignin, subContractorByClient)
router.get("/team/by/:clientId", clientRequireSignin, teamByClient)
router.get("/client/by/:createdBy",clientRequireSignin,clientBysubcontractor)
router.param("clientId", clientById)

module.exports=router