const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const mirFolder = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    belongsTo:{
        type:ObjectId,
        ref:"Project"
    }
})

module.exports =    mongoose.model("mirFolder",mirFolder)