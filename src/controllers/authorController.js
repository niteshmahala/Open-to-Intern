const authorModel = require('../models/authorModel')
const validator = require("email-validator")

const createAuthor = async function (req , res) {

    try {
        let data = req.body
        let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ; 

        //first method for email validation using regular expression

        if(!re.test(data.email)){ 
            res.status(400).send({status: false , msg: "Invalid EmailId"})
        }

        //second method for email validation using email validator

        if(validator.validate(data.email)){
            let author = await authorModel.create(data)
            res.status(201).send({status: true , data: author})
        }
        else{
            res.status(400).send({status: false , msg: "Invalid EmailId"})
        }
           
    } catch (err) {
        
        res.status(500).send({status: false , error: err.message})
    }
}

module.exports.createAuthor = createAuthor