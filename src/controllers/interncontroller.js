const internmodel = require('../models/internmodel')
const collegemodel = require('../models/collegemodel')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const dv = /[a-zA-Z]/;

// const createintern = async function (req , res) {

//     try {
//         let data = req.body

//          // Validate the blog data is present or not
//         if (Object.keys(data).length == 0) { 
//             return res.status(400).send({ status: false, msg: "Invalid request !! Please Provide Blog Details"})
//           }

//           // Validate that authorid is coming or not in blog
//           if (data.authorId.length==0) {
//             return res.status(400).send({ status: false, msg: "Please Provide Blog Author Id"})
//         }
//         data.authorId = data.authorId.trim()    //remove space from authorid
//         // Validate the authorId
//         if(!ObjectId.isValid(data.authorId)) {
//             return res.status(400).send({status: false , msg:"Invalid Author-Id"})
//          }

//          // authorization
//          let decodedToken =  req.decodedToken
//         if( data.authorId != decodedToken.authorId ){
//             return res.status(400).send({status: false , msg: "Author is Different"})
//         }
       
        
//         // Validate the title in blog 
//         if ( data.title.length==0 || !dv.test(data.title)) {
//             return res.status(400).send({ status: false, msg: "Please Provide Blog Title"})
//         }

//         // Validate the Body in blog 
//         if ( data.body.length==0 || !dv.test(data.body)) { 
//             return res.status(400).send({ status: false, msg: "Please Provide Blog's Body"})
//         }

//           // Validate the category in blog
//         if (data.category.length == 0 || !dv.test(data.category)) {
//             return res.status(400).send({ status: false, msg: "Please Provide Blog category"})
//         }
//         data.category = data.category.toLowerCase().trim()  //save data in lowercase and remove the spaces
        
//         //validate the tags in blog
//         if( data.tags != undefined && check(data.tags) == false){
//             return res.status(400).send({ status: false, msg: "Please Provide Valid Tags"})
//         }
       
//         //validate the tags in blog
//         if( data.subcategory != undefined &&  check(data.subcategory)== false){
//             return res.status(400).send({ status: false, msg: "Please Provide Valid Subcategory"})
//         }
//         // for array data like tags and subcategory
//         for (let key in data) {
//             if (Array.isArray(data[key])) {
//                 let arr=[];
//                 for (let i = 0; i < data[key].length; i++) {
//                         if(data[key][i].trim().length>0)
//                     arr.push(data[key][i].toLowerCase().trim())
//                 }
//                 data[key] = [...arr];
//             }
//         }
        
        
//         let authorId = await collegemodel.findById(data.authorId)
//         // check authorId
//         if(!authorId) {
//             return res.status(400).send({status: false , msg:"Invalid Author-Id"})   
//         }
//         if(data.isPublished == true){
//             data.publishedAt =  new Date().toISOString()  // add the date if isPublished is true
//         }
        
//         let blog = await internmodel.create(data)
//         res.status(201).send({status: true , data: blog})
           
//     } 
//     catch (err) {
//         res.status(500).send({status: false , error: err.message})
//     } 

   
// }


// const getintern = async function (req , res) {
//     try{
        
        
//         let queryData = req.query
//          if (Object.keys(queryData).length == 0) { 
//             let blogInfo = await internmodel.find({isPublished: true , isDeleted: false})
//             if(!blogInfo){
//                 return res.status(404).send({status: false , msg:"Document not found"})
//             }
//             return res.status(200).send({status: true , data:blogInfo})
//           }
//         //   check if filter have  value 
//         if(!(queryData.authorId || queryData.category || queryData.tags || queryData.subcategory ) ){
//             return res.status(400).send( {status: false , msg: "Invalid Filters"})
//         }
//         // Authorization
//         let decodedToken =  req.decodedToken
//         if(queryData.authorId != undefined && queryData.authorId != decodedToken.authorId ){
//             return res.status(400).send({status: false , msg: "Author is Different"})
//         }
//         if(queryData.authorId == undefined) 
//         queryData.authorId =  decodedToken.authorId
//         // check if  query are valid
//         if(req.query.title && !req.query.body) delete req.query.title
//         else if(req.query.body && !req.query.title) delete req.query.body
//         else if(req.query.title && req.query.body){
//             delete req.query.title
//             delete req.query.body
//         }

//         queryData = req.query
    
//         if(queryData.authorId && !(ObjectId.isValid(queryData.authorId))){
//             return res.status(400).send( {status: false, msg: 'AuthorId is Invalid'})
//         }
        
//         if(queryData.authorId ){ 
//              let authorId = await collegemodel.findById(queryData.authorId)
//              if(!authorId) {
//                 return res.status(404).send({status: false , msg:"Author not Found"})   
//             }
//         }
        
//             if(queryData.category){
//                 queryData.category = queryData.category.toLowerCase().trim()  // remove the space in category and save in lowecase
//             }

//             if(queryData.tags) queryData.tags = queryData.tags.toLowerCase().trim()  // remove the space in tags and save in lowecase
//             if(queryData.subcategory) queryData.subcategory = queryData.subcategory.toLowerCase().trim()   // remove the space in subcategory and save in lowecase
            
//             // for array data like tags and subcategory
//             for (let key in queryData) {
//                 if (Array.isArray(queryData[key])) {
//                     let arr=[];
//                     for (let i = 0; i < queryData[key].length; i++) {
//                             if(queryData[key][i].trim().length>0)
//                         arr.push(queryData[key][i].toLowerCase().trim())
//                     }
//                     queryData[key] = [...arr];
//                 }
//             }
//           console.log(queryData)
//             //  check if it is not deleted and published
//             queryData.isDeleted = false
//             queryData.isPublished = true
//             const blogData = await internmodel.find(queryData)
 
//             if(blogData.length == 0){
//                 return res.status(404).send({status: false , msg: 'Document Not Found'})
//             } 
//             return res.status(200).send({status: true , Data: blogData})
//     }
//     catch(err){
//         res.status(500).send({status: false , error: err.message})
//     } 
    
// }


// module.exports.createintern = createintern
// module.exports.getintern = getintern


