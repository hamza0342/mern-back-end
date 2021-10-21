var teamMembers = require("../model/teamMembers")


exports.addTeammember = (req,res)=>{



    console.log("In teamMeber file  Controller")
    console.log(req.body)
    console.log(req.params.projectId)
    let member = new teamMembers({
        name:req.body.name,
        email:req.body.email,
        createdBy:req.body.createdBy
    })
    console.log("Creating member ", req.body)
    let projectId = req.params.projectId; 
    console.log(projectId)
    member.asssignedProjects = projectId

    member.save((err,result)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.status(200).json({
            folder:result
        })
    })


}


exports.getTeamMembers= async(req,res) =>{

    const member =await teamMembers.find()
    .populate("asssignedProjects","title -_id")
    // .populate('comments.postedBy', '_id name')
    .exec((err, projects) => {
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(projects)
    })
}


