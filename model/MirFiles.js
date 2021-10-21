const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema
// const MirSubFile = require('./MirSubFiles')

// Creating a Schema for uploaded files
const MirFileSchema = new mongoose.Schema({
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
  status:{
    type:String,
    default : "Pending"
  },
  belongsTo:{
    type:ObjectId,
    ref:"MirFolder"
}
});

const File = mongoose.model("MirFile", MirFileSchema);

// MirFileSchema.pre('deleteOne', function(next) {
//   const id = this.getQuery()['_id'];
//   MirSubFile.deleteMany({ belongsTo: id }, (err, value) => {
//   });
//   next();
// });
module.exports = File;

