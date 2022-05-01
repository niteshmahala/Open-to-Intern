const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const mongoose = require('mongoose');
const { query } = require('express');
const ObjectId = mongoose.Types.ObjectId


const createBlog = async function (req , res) {

    try {
        
        let data = req.body

         // Validate the blog data is present or not
        if (Object.keys(data).length == 0) { 
            return res.status(400).send({ status: false, msg: "Invalid request !! Please Provide Blog Details"})
          }
       
          const dv = /[a-zA-Z]/;
        // Validate the title in blog
        if ( data.title.length==0 || !dv.test(data.title)) {
            return res.status(400).send({ status: false, msg: "Please Provide Blog Title"})
        }

        // Validate the Body in blog
        if ( data.body.length==0 || !dv.test(data.body)) { 
            return res.status(400).send({ status: false, msg: "Please Provide Blog's Body"})
        }

        // Validate that authorid is coming or not in blog
        if (data.authorId.length==0) {
            return res.status(400).send({ status: false, msg: "Please Provide Blog Author Id"})
        }

        // Validate the authorId
        if(!ObjectId.isValid(data.authorId)) {
            return res.status(400).send({status: false , msg:"Invalid Author-Id"})
         }

        if (data.category.length == 0 || !dv.test(data.category)) {
            return res.status(400).send({ status: false, msg: "Please Provide Blog category"})
        }

        if( data.tags.length == 0 || !(data.tags.every(e => typeof e === 'string'))){
            return res.status(400).send({ status: false, msg: "Please Provide Valid Tags"})
        }
       

        if( data.subcategory.length == 0 || data.subcategory.every(e => typeof(e) === 'string') == false){
            return res.status(400).send({ status: false, msg: "Please Provide Valid Subcategory"})
        }
        
        
        let authorId = await authorModel.findById(data.authorId)
        
        if(!authorId) {
            return res.status(400).send({status: false , msg:"Invalid Author-Id"})   
        }
        if(data.isPublished == true){
            data.publishedAt =  new Date().toISOString()
        }
        // else{
        //     data.publishedAt = ""
        // }
        let blog = await blogModel.create(data)
        res.status(201).send({status: true , data: blog})
        
           
    } 
    catch (err) {
        res.status(500).send({status: false , error: err.message})
    }
}


const getBlogs = async function (req , res) {
    try{
        
        
        let queryData = req.query
        //console.log(queryData + " " + Object.keys(queryData).length)
        if (Object.keys(queryData).length == 0) { 
            return res.status(400).send({ status: false, msg: "Invalid request !! Please Provide Blog Details"})
          }

        if(!(queryData.authorId || queryData.category || queryData.tags || queryData.subcategory ) ){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }

        let decodedToken =  req.decodedToken
        if(queryData.authorId != undefined && queryData.authorId != decodedToken.authorId ){
            return res.status(400).send({status: false , msg: "Author is Different"})
        }
        if(queryData.authorId == undefined) queryData.authorId =  decodedToken.authorId

        if(req.query.title && !req.query.body) delete req.query.title
        else if(req.query.body && !req.query.title) delete req.query.body
        else if(req.query.title && req.query.body){
            delete req.query.title
            delete req.query.body
        }

        queryData = req.query

        if(queryData.authorId && !(ObjectId.isValid(queryData.authorId))){
            return res.status(400).send( {status: false, msg: 'AuthorId is Invalid'})
        }
        
        if(queryData.authorId != null){ 
             let authorId = await authorModel.findById(queryData.authorId)
             if(!authorId) {
                return res.status(404).send({status: false , msg:"Author not Found"})   
            }
        }
        
        
            queryData.isDeleted = false
            queryData.isPublished = true
            const blogData = await blogModel.find( queryData )
           // console.log(blogData);
            if(blogData.length == 0){
                return res.status(404).send({status: false , msg: 'Document Not Found'})
            } 
            return res.status(200).send({status: true , Data: blogData})
        

    }
    catch(err){
        res.status(500).send({status: false , error: err.message})
    }

}

const updateBlogs = async function ( req , res) {
    try {
        let blog = req.body

        if (Object.keys(blog).length == 0) { 
            return res.status(400).send({ status: false, msg: "Invalid request !! Please Provide Blog Details"})
          }

        if(! (blog.title || blog.body || blog.tags || blog.subcategory || blog.isPublished) ){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }

        let blogId = req.params.blogId

        // if(!ObjectId.isValid(blogId)){
        //     return res.status(400).send({status: false , msg:"Invalid Blog-Id"})
        // }

        let blogData = await blogModel.findById(blogId)
        if(!blogData || blogData.isDeleted == true){
            return res.status(404).send({status: false , msg: "Document Not Found"})
        }

        if(blogData.isPublished == false && blog.isPublished == true){
            blogData.isPublished = true
            blogData.publishedAt = new Date().toISOString()
        }
        await blogData.save()

        let updatedBlog = await blogModel.findByIdAndUpdate( {_id : blogId},
                {$addToSet : {tags : blog.tags , subcategory: blog.subcategory} , $set : {title: blog.title , body: blog.body }},
                {new : true}
            )
        
            res.status(200).send({status: true , updatedData: updatedBlog})
            
            
    } catch (err) {
        res.status(500).send({status: false , error: err.message})  
    }
}

const deleteByBlogId = async function ( req , res){
    try {
        let blogId = req.params.blogId
        // if(!ObjectId.isValid(blogId)){
        //     return res.status(400).send({status: false , msg:"Invalid Blog-Id"})
        // }

        let blogData =  await blogModel.findById(blogId)
        if(!blogData || blogData.isDeleted == true){
            res.status(404).send({status: false , msg: "Data Not Found"})
        }
      
        blogData.isDeleted = true
        blogData.deletedAt = new Date().toISOString()
        await blogData.save()
        res.status(200).send({msg:"Document is Successfully Deleted"})

        
        
    } catch (err) {
        res.status(500).send({status: false , error: err.message}) 
    }
}




const deleteByQuery = async function (req, res) {
    try {

        let queryData = req.query
        let decodedToken = req.decodedToken
        if(queryData.authorId && decodedToken.authorId != queryData.authorId ){
            return res.status(403).send({status: false , msg: "Author is not allowed to perform this task"})
        } 
        
        queryData.authorId = decodedToken.authorId 
        

        if (!(queryData.category || queryData.authorId || queryData.tags || queryData.subcategory)) {
            return res.status(404).send({ status: false, msg: "Invalid Request...." })
        }

        if (queryData.authorId && !(ObjectId.isValid(queryData.authorId))){
            return res.status(400).send( {status: false, msg: 'AuthorId is Invalid'})
        }

        if(queryData.authorId){
            let authorId = await authorModel.findById(queryData.authorId)
            if(!authorId) {
                return res.status(404).send({status: false , msg:"Author not Found"})   
            }
        }
        
  
      let deletedDate = new Date().toISOString()
      queryData.isDeleted = false
      let data1 = await blogModel.updateMany(queryData, { isDeleted: true, deletedAt: deletedDate }, { new: true })
    
      if(data1.matchedCount == 0){
          return res.status().send( {status: false , msg: 'No match found'})
      }
      return res.status(200).send({ status: true, msg: data1 })
    } catch (error) {
      return res.status(500).send({ status: false, msg: error.message });
    }
  }



module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleteByBlogId = deleteByBlogId
module.exports.deleteByQuery = deleteByQuery



// for remove white space var arr = ['Apple', '  ', 'Mango  man', '', '    Banana     ', ' ', '     Strawberry'];
// const helper =arr=>arr.join().split(/\s|,/).filter(Boolean);
// console.log(helper(arr))