const mongoose = require('mongoose')
const uuidv1 = require("uuidv1")
const crypto = require("crypto")
const { ObjectId } = mongoose.Schema
const Project = require("../model/project")

const clientSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required: true,
        // match:[
        //     new RegExp('^[a-z]+$', 'i'),
        //     'Name Should have alphabets'
        // ]
    },
    
    phone:{
        type: String,
        trim: true,
        required: true,
        unique: true

    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    hashed_password:{
        type: String,
        required: true

    },
    isAdmin:{
        type:String,
        default:false
    },
    salt:String,
    created:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type: ObjectId,
        ref: "Admin"
    },
    isAdmin:{
        type:String,
        default:false
    },
    isDeleted:{
        type : String,
        default: false

    },
    updated: Date

})


clientSchema.virtual('password')
.set(function(password){
    this._password = password
    // generate a timestamp
    this.salt = uuidv1()
    // encrypt password
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

clientSchema.methods = {

    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password){
        if(!password) return "";
        try{
            return crypto
                    .createHmac("sha1", this.salt)
                    .update(password)
                    .digest('hex');
        }catch (err){
            return ""
        }
    }
}
//deletes every project which is referenced to a client..
// clientSchema.pre("",function(next){
//     this.model("SubContrator").remove({
//         createdBy:this._id
//     },next)
// })


module.exports = mongoose.model("Client", clientSchema)