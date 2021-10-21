const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const teamMembers = new mongoose.Schema({
    name:{
        type:String,
        
    },
    phone:{
        type: String,
        

    },
    email:{
        type: String,
            },
    createdBy: {
        type: ObjectId, 
        ref: "Client"
    },
    assignedDate :{
        type:Date,
        default: Date.now
    },
    asssignedProjects :[{
        type:ObjectId,
        ref:"Project"
    }]
})

module.exports = mongoose.model("teamMembers", teamMembers)
// subContractorSchema.virtual('password')
// .set(function(password){
//     this._password = password
//     // generate a timestamp
//     this.salt = uuidv1()
//     // encrypt password
//     this.hashed_password = this.encryptPassword(password)
// })
// .get(function(){
//     return this._password
// })

// subContractorSchema.methods = {

//     authenticate: function(plainText){
//         return this.encryptPassword(plainText) === this.hashed_password
//     },

//     encryptPassword: function(password){
//         if(!password) return "";
//         try{
//             return crypto
//                     .createHmac("sha1", this.salt)
//                     .update(password)
//                     .digest('hex');
//         }catch (err){
//             return ""
//         }
//     }
// }
