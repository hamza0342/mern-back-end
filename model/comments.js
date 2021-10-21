const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const commentSchema = new mongoose.Schema(
  {
      comment:{
        type:String
      },
    belongsTo: {
        type:ObjectId,
      ref:"Project"
    },
    postedBy:{
        type:String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentSchema);
