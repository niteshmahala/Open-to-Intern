const jwt = require('jsonwebtoken')
const authorModel = require('../models/authorModel')
const validator = require("email-validator")

const createAuthor = async function (req , res) {

    try {
        let data = req.body

        // if(!(data.fname && data.lname && data.title && data.email && data.password)){
        //     res.status(400).send({status: false , msg: "missing mandatory field"})
        // }

        if(Object.keys(data).length == 0){
            return res.status(400).send( { status: false , msg: 'Invalid Request !! Please Enter Author Detail '})
        }

        if(!data.fname){
            return res.status(400).send( { status: false , msg: 'Please Enter Author First Name '})
        }

        if(!data.lname){
            return res.status(400).send( { status: false , msg: 'Please Enter Author Last Name '})
        }

        if(!['Mr','Mrs','Miss'].includes(data.title)){
            return res.status(400).send({status: false , msg: "Title Must be of these values [Mr, Mrs, Miss] "})
        }

        if(!data.email){
            return res.status(400).send( { status: false , msg: "Please Enter Author's Email "})
        }

        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ; 

        //first method for email validation using regular expression

        if(!re.test(data.email)){ 
            return res.status(400).send({status: false , msg: "Invalid EmailId Address "})
        }

        existingEmail = await authorModel.findOne({email : data.email})

        if(existingEmail){
            return res.status(400).send({status: false , msg: "User with this email is already exist "})
        }

        if(!data.password){
            return res.status(400).send({status: false , msg: "Please Enter Password of Author "})
        }

        

        let author = await authorModel.create(data)
        res.status(201).send({status: true , msg:"Author Created Successfully" , data: author})

        //second method for email validation using email validator

        // if(validator.validate(data.email)){
        //     let author = await authorModel.create(data)
        //     res.status(201).send({status: true , data: author})
        // }
        // else{
        //     res.status(400).send({status: false , msg: "Invalid EmailId"})
        // }
           
    } catch (err) {
        
        res.status(500).send({status: false , error: err.message})
    }
}

const loginAuthor = async function ( req, res) {

    try {
        let data = req.body

        if(Object.keys(data).length == 0){
            return res.status(400).send( { status: false , msg: 'Invalid Request !! Please Enter Author Email, Password '})
        }

        let userName = data.email;
        let password = data.password;
        if(userName !== '' && password !== ''){

            let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ; 
            let pwdRe  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if((re.test(userName)==true)){
            
                let user = await authorModel.findOne( {email: userName , password: password});
                console.log(user);
                if(!user) res.status(400).send({  msg: "Invalid username or the password" })
    
                let token = jwt.sign(
                    {
                        authorId: user._id.toString(),
                        batch: "uranium",
                        organisation: 'FunctionUp'
                    },
                    "functionup-uranium"
                )
                res.setHeader('x-api-key' , token)
                res.status(201).send({ status: true, data: token });
        
            }
            else res.status(401).send({msg:'Invalid Username or Password'})

        }
        else res.status(400).send({msg:'UserName, Password are missing'})
        
    } 
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor