const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

// Creating a Schema for uploaded files
const MirSubFileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: [true, "Uploaded file must have a text"],
  },
  image: {
    type: String
  },
  uploadedBy: {
    type: String
  },
  status: {
    type: String,
    default: "Pending"
  },
  belongsTo: {
    type: ObjectId,
    ref: "MirFile"
  }
});

const File = mongoose.model("MirSubFile", MirSubFileSchema);


module.exports = File;