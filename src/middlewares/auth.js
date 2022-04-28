const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");

///--------------- middleware for token verification 

let authentication = function (req , res , next){
    //console.log("innerAuth");
    try {

        
        let token = req.headers['x-api-key']

        if(!token) return res.status(401).send({message: "token must be present" })

        let decodedToken = jwt.verify( token , "functionup-uranium")

        if(!decodedToken){
            return res.status(404).send({status: false , msg: "Token is not present"})
        }
        req.decodedToken = decodedToken
        next()
    } 
    catch(err) {
        return res.status(401).send({  message: "token is invalid"})
    }

}

let authorisation = async function (req, res , next){

    try {

        
        blogAuthorId = await blogModel.findById(req.param.blogId).select({ authorId: 1, _id: 0})
        
        let decodedToken = req.decodedToken
    
        if(decodedToken.authorId != blogAuthorId)
            return res.status(401).send({  error: 'Author is not allowed to perform this task'})
    
        next()
    } 
    catch(err) {
        return res.status(401).send({  message: "token is invalid"})
    }
}
/*
let auth1 = async function (req, res , next){

    try {

       /* let data = req.query

        blogAuthorId = await blogModel.find(data).select({ authorId: 1, _id: 0})
        
        let decodedToken = req.decodedToken

        let flag  = false
        let aId = ''
        for( let i = 0 ; i < blogAuthorId ; i++){
            if(decodedToken.authorId == blogAuthorId[i]){
                aId =  blogAuthorId[i]
                flag = true;
                break;
            }
        }
        if(flag == true){
            req.query.authorId = aId
            next()
        } 



        return res.status(401).send({  error: 'Author is not allowed to perform this task'})
    
    } 
    catch(err) {
        return res.status(401).send({  message: "token is invalid"})
    }
} */

module.exports.authentication = authentication
module.exports.authorisation = authorisation