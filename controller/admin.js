const _ =require("lodash")
const Admin = require("../model/admin")
const Client= require("../model/client")
const SubContrator= require("../model/subContractor");


exports.adminById = (req,res,next,id) =>{
    Admin.findById(id).exec((err, admin) =>{

        if(err|| !admin){
            return res.status(400).json({
                error:"Admin not found"
            })
        }

        req.profile = admin
        next()

    })
}

exports.hasAuthorization = (req, res, next) =>{
    var authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized){
        return res.status(403).json({
            error: "Admin is not authorized to perform this action"
        })
    }
}


exports.allAdmin = (req, res) =>{
    Admin.find((err, admin) =>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json({
            admin
        })
    }).select("name email updated created")
}


exports.getAdmin = (req,res) =>{
    console.log(req.body)
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)
}

exports.updateAdmin = (req,res, next)=>{
    let admin = req.profile
    admin = _.extend(admin, req.body);// extend - mutate the source object
    admin.updated = Date.now();
    admin.save((err)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error: "You are not authorized  to perform this action"
    
            })
        }
        admin.hashed_password = undefined;
        admin.salt = undefined;
        res.json({
            admin
        });
    
    })    
};

exports.deleteClient = async (req, res) => {
    let id = req.body.id;
    let client = await Client.findOne({ _id: id });
    if (client) {
            client.delete();
            res.status(200).json({
                message: "Deleted successfully.",
            });
    } else {
        res.status(404).json({
            message: "The Client with specified ID is not found.",
        });
    }
};




//function to disable client's account it will update isDeleted true
exports.disableClient = async (req, res) => {
    let id = req.body.id;
    console.log("user id =========>" ,id )
    await Client.findByIdAndUpdate(id,{isDeleted : true },async (err,doc)=>{
        if (err){
            res.status(400).json({
                message:err.message
            })
            console.log(err)
        }
        else{
            let createdBy = id
            await SubContrator.findOneAndUpdate(createdBy,{isDeleted:true},{new:true},(err,data)=>{
                if(err){
                    res.status(400).json({
                        message:"Error in updating subcontractor"
                    })
                    console.log("Error in updating subcontractor")
                }
                else{
                    res.status(200).json({
                        message:"User updated"
                    })
                    console.log("CLient and subcontractor updated")
                }
            })
        //     res.status(200).json({
        //         message:"User updated"
        //     })
        //     console.log("Updated User : ", doc);
        }
    });
    
};

exports.enableClient = async (req, res) => {
    let id = req.body.id;
    console.log("user id =========>" ,id )
    await Client.findByIdAndUpdate(id,{isDeleted : false }, async (err,doc)=>{
        if (err){
            res.status(400).json({
                message:err.message
            })
            console.log(err)
        }
        else{
            let createdBy = id
            await SubContrator.findOneAndUpdate(createdBy,{isDeleted:false},{new:true},(err,data)=>{
                if(err){
                    res.status(400).json({
                        message:"Error in updating subcontractor"
                    })
                    console.log("Error in updating subcontractor")
                }
                else{
                    res.status(200).json({
                        message:"User updated"
                    })
                    console.log("CLient and subcontractor updated")
                }
            })

            // res.status(200).json({
            //     message:"User updated"
            // })
            // console.log("Updated User : ", doc);
        }
    });
    
};

//function to get registered clients with isDeleted = false
exports.getcount = async(req,res)=>{
    Client.countDocuments({isDeleted:'false'}, function( err, count){
        console.log( "Number of users:", count );
        res.status(200).json({
            message : `${count}`
        })
    })
}


//function to get registered clients with isDeleted = false
exports.getcount = async(req,res)=>{
    await Client.countDocuments({isDeleted:'false'},(err, count)=>{
        if(err){
            res.status(400).json({
                message:err.message
            })
        }
        else{
            res.status(200).json({
                message : `${count}`
            })    
        }
        
    })
}


//function to total count of disable clients isDeleted = true
exports.getDisableCount = async(req,res)=>{
    await Client.countDocuments({isDeleted:'true'}, function( err, count){
        res.status(200).json({
            message : `${count}`
        })
    })

}



//delete sc
exports.deleteSC = async (req, res) => {
    let id = req.body.id;
    let sc = await SubContrator.findOne({ _id: id });
    if (sc) {
            sc.delete();
            res.status(200).json({
                message: "Deleted successfully.",
            });
    } else {
        res.status(404).json({
            message: "The contributer with specified ID is not found.",
        });
    }
};


exports.deleteAdmin = (req,res,next) => {
    let admin = req.profile
    admin.remove((err, admin)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        admin.hashed_password = undefined
        admin.salt = undefined
        res.json({
            message:"Admin has been deleted"
        })
    })
}