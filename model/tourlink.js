const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

// Creating a Schema for uploaded files
const tourlink = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    link:{
        type:String,
        required:true
    },
    belongsTo: {
        type: ObjectId,
        ref: "tourFolder"
    }
});

// Creating a tourFile Model from that Schema
const tourLink = mongoose.model("tourlink", tourlink);

// Exporting the tourFile Model to use it in app.js File.
module.exports = tourLink;