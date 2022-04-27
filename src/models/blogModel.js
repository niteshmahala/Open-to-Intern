const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId: {
        required: true,
        type: ObjectId,
        ref: 'Author'
    },
    tags: {
        type: [String]
    },
    category: {
        type: [String],
        required: true,   
    },
    subcategory: {
        type:[String]
    },

    deletedAt: String,

    isDeleted: { 
        type: Boolean, 
        default: false
    },


    publishedAt: String,

    isPublished: {
        type:Boolean,
        default:false,
    },
    
    
    
    
},{timestamps:true})


module.exports = mongoose.model("Blog", blogSchema)