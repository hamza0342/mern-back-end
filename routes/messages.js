const router = require("express").Router();
const Message = require("../model/Message");
const Conversation = require('../model/Conversation')

//add

router.post("/", async (req, res) => {

   console.log("Conversation Id ===>", req.body.conversationId)
   console.log("Notification ==> " , req.body.notification)
   console.log("Type ===>",typeof(req.body.notification))
   console.log("Sender ID===>", req.body.sender)

   Conversation.findById({_id:req.body.conversationId}).exec().then((result)=>{
        let userA = result.userA;
        let userB = result.userB;

        let notificationA = userA[1].notifications
        let notificationB = userB[1].notifications
        console.log("Type of notification B====>",typeof(notificationB))
        let newNotificationA = notificationA + req.body.notification
        let newNotificationB = notificationB + req.body.notification
        console.log("User A notifications ===>",notificationA)
        console.log("User B notifications ====>",notificationB)
        console.log("Added notifications for User A  ====>",newNotificationA)
        console.log("Added notifications for User B  ====>",newNotificationB)

        if(userA[0].id == req.body.sender){
          console.log("userB id===>",userB[0].id)
      
          Conversation.findByIdAndUpdate({_id:req.body.conversationId},{
              userB:[{id:userB[0].id},{notifications:newNotificationB}]
            }).exec().then((result)=>{console.log("result after updating user B====>",result)}).catch((err)=>{console.log("Error updating userB")})
      }
      else{
        console.log("userA id===>",userA[0].id)

        Conversation.findByIdAndUpdate({_id:req.body.conversationId},{
          userA:[{id:userA[0].id},{notifications:newNotificationA}]
        }).exec().then((result)=>{console.log("result after updating user A ====>",result)}).catch((err)=>{console.log("Error updating userA")})
      }
   }).catch((err)=>{
     console.log("Error in finding conversation")
   })

  const newMessage = new Message(req.body);


  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
