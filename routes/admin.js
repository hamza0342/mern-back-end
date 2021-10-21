var express = require("express")
var { adminById,
      allAdmin,
      getAdmin,
      updateAdmin, 
      deleteAdmin,
      deleteClient,
      deleteSC,
      disableClient,
      enableClient,
      getcount,
      getDisableCount } =  require("../controller/admin")
var {requireSignin,checkAuth} = require("../controller/auth")

var router = express.Router();

router.get("/admins", allAdmin)
router.get("/admin/:adminId",requireSignin, getAdmin)
router.put("/admin/:adminId",requireSignin, updateAdmin)
router.patch("/disableclient",requireSignin,checkAuth,disableClient)
router.patch("/enableclient",requireSignin,checkAuth,enableClient)
router.delete("/admin/:adminId", requireSignin, deleteAdmin)
router.delete("/deleteclient", requireSignin, deleteClient)
router.delete("/deletesc", requireSignin, deleteSC)
router.get('/getcount',getcount)
router.get('/getdisabledcount',getDisableCount)

router.param("adminId", adminById)

module.exports=router 