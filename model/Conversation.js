const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      
    },
    user1:{
      type:String
    },
    user2:{
      type:String
    },
    userA:[
      {
       id:{type:String},
       notifications:{type:Number}
      }
      
    ],
    userB:[
      {
       id:{type:String},
       notifications:{type:Number}
      }
      
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
