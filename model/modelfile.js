const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

// Creating a Schema for uploaded files
const modelFileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, "Uploaded file must have a name"],
  },
  image:{
    type:String
  },
  belongsTo:{
    type:ObjectId,
    ref:"Folder"
}
});

const File = mongoose.model("ModelFile", modelFileSchema);


module.exports = File;