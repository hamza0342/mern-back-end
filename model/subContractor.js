const mongoose = require('mongoose')
const uuidv1 = require("uuidv1")
const crypto = require("crypto")
const { ObjectId } = mongoose.Schema

const subContractorSchema = new mongoose.Schema({
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
        unique: true

    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password:{
        type: String,
        required: true

    },
    salt:String,
    created:{
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: ObjectId,
        ref: "Client"
    },
    projects:[{
        type: ObjectId,
        ref:"Project"
    }],
    teamMember:{
        type:String,
        default:false
    },

    role:[{
      
         type:String,
      
    }],
    isDeleted:{
        type : String,
        default: false

    },
    updated: Date
})


subContractorSchema.virtual('password')
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

subContractorSchema.methods = {

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
module.exports = mongoose.model("SubContrator", subContractorSchema)