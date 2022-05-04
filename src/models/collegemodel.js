const mongoose = require('mongoose')

const collegeschema = new mongoose.Schema ( {
    name: {
        type: String,
        trim: true,
        required: true
    },
    fullname: {
        type: String,
        trim: true,
        required: true,
    },
    logolink: {
        type: String,
        trim: true,
        required: true,
    },
    isDeleted: {
        type: Boolean,
       default:false
    },
} , { timestamps : true})

module.exports = mongoose.model("College", collegeschema);//colleges