const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const internschema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        required:true
    },
    email:{
        type:String,
        trim: true,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    collegeId: {
        required: true,
        trim: true,
        type: ObjectId,
        ref: 'college'
    },
   isDeleted : {
       type:Boolean,
       default:false
   } 
},{timestamps:true})


module.exports = mongoose.model("Blog", internschema);//blogs