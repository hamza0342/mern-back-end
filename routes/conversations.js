const router = require("express").Router();
const { NextWeek } = require("@material-ui/icons");
const Conversation = require("../model/Conversation");

//new conv

router.post("/", async (req, res) => {

  console.log(req.body)
  console.log("clientId ", req.body.senderId)
  console.log("subId" , req.body.receiverId)
  console.log("Name " , req.body.user1)
  console.log("Name 2 ===> ", req.body.user2)
  const newConversation = new Conversation({
    user1:req.body.user1,
    user2:req.body.user2,
    members: [req.body.senderId, req.body.receiverId],
    userA:[{id:req.body.senderId},{notifications:0}],
    userB:[{id:req.body.receiverId},{notifications:0}]
  });

  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if(!conversation){
      const savedConversation = await newConversation.save();
      return res.status(200).json(savedConversation);
    }else{


     console.log("safe solution")
        
          const conversation = await Conversation.findOne({
            members: { $all: [req.body.senderId, req.body.receiverId] },
          });
          return res.status(200).json(conversation)
        } 
      


      // return  res.status(200).json(conversation)
    
    
    
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/update/notification",async(req,res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  try{
      console.log("Conversation Id " , req.body.conversationId)
      console.log("User Id " , req.body.userId )
      Conversation.findById({_id:req.body.conversationId}).exec().then((result)=>{
        let userA = result.userA;
        let userB = result.userB;
        console.log(userA)
        
        if(result.userA[0].id == req.body.userId){
          Conversation.findByIdAndUpdate({_id:req.body.conversationId},{
            userA:[{id:userA[0].id},{notifications:0}]}).exec().then((result)=>{
                console.log("Update hay ==>",result)
            })
          console.log("Notifications ===>",result.userA[1].notifications)
        }else{
          Conversation.findByIdAndUpdate({_id:req.body.conversationId},{
            userB:[{id:userB[0].id},{notifications:0}]}).exec().then((result)=>{
                console.log("Update hay ==>",result)
            })
          console.log("Notifications ===>",result.userA[1].notifications)
        }
        res.send("OK")
      }).catch((err)=>{
        console.log(err)
        res.send("Not Ok")
      })
      
  }
  catch{}
})

//route to get notifications

module.exports = router;
