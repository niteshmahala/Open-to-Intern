const jwt = require('jsonwebtoken')
const collegemodel = require('../models/collegemodel')
//   const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/; //email
  const dv = /[a-zA-Z]/;   //string 
const createcollege = async function (req , res) {

    try {
        let data = req.body 
       // Validate the  data is present or not
        if(Object.keys(data).length == 0){
            return res.status(400).send( { status: false , msg: 'Invalid Request !! Please Enter college Detail '})
        }
        //check for blank data or match with regex syntax
        if(data.name.length == 0 || !dv.test(data.name)){
            return res.status(400).send( { status: false , msg: 'Please Enter college Name '})
        }
        // Validate the  fullname is present or not
        if(data.fullname.length == 0  || !dv.test(data.fullname)){
            return res.status(400).send( { status: false , msg: 'Please Enter college full Name '})
        }
        // Validate the  logolink is present or not
        if(data.logolink.length == 0  || !dv.test(data.logolink)){
            return res.status(400).send( { status: false , msg: 'Please Enter logolink'})
        }
        // Validate the  name is unique or not
        let clg = await collegemodel.find();
        if(clg.name == data.name)return res.status(400).send({ status:false, msg: "this name is already exist"})


        let college = await collegemodel.create(data)
        res.status(201).send({status: true , msg:"college Created Successfully" , data:college})
           
    } catch (err) {
        
        res.status(500).send({status: false , error: err.message})
    }
}

// const loginAuthor = async function ( req, res) {

//     try {
//         let data = req.body
//          // Validate the  data is present or not
//         if(Object.keys(data).length == 0){
//             return res.status(400).send( { status: false , msg: 'Invalid Request !! Please Enter Author Email, Password '})
//         }
//         //convert email in lowercase
//         let userName = data.email.toLowerCase();
//         let password = data.password;
//         if(userName !== '' && password !== ''){
            
//             // email validation using regex
//             if((re.test(userName)==true)){
            
//                 let user = await collegemodel.findOne( {email: userName , password: password});
//                 if(!user) 
//                 return res.status(400).send({  msg: "Invalid username or the password" })
    
//                 let token = jwt.sign(
//                     {
//                         authorId: user._id.toString(),
//                         batch: "uranium",
//                         organisation: 'FunctionUp'
//                     },
//                     "functionup-uranium"
//                 )
//                 res.setHeader('x-api-key' , token)
//                 res.status(201).send({ status: true, data: token });
        
//             }
//             else
//              return res.status(401).send({msg:'Invalid Username'})

//         }
//         else
//      return res.status(400).send({msg:'UserName, Password are missing'})
        
//     } 
//     catch (err) {
//        return res.status(500).send({ msg: "Error", error: err.message })
//     }

// }
module.exports.createcollege= createcollege
// // module.exports.loginAuthor = loginAuthor
