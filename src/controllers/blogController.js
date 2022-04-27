const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const mongoose = require('mongoose');
const { query } = require('express');
const ObjectId = mongoose.Types.ObjectId


const createBlog = async function (req , res) {

    try {
        
        let data = req.body

         // Validate the blog data is present or not
        if (!data) { 
            return res.status(400).send({ status: false, msg: "Invalid request !! Please Provide Blog Details"})
          }
       

        // Validate the title in blog
        if (!data.title) {
            return res.status(400).send({ status: false, msg: "Please Provide Blog Title"})
        }

        // Validate the Body in blog
        if (!data.body) { 
            return res.status(400).send({ status: false, msg: "Please Provide Blog's Body"})
        }

        // Validate that authorid is coming or not in blog
        if (!data.authorId) {
            return res.status(400).send({ status: false, msg: "Please Provide Blog Author Id"})
        }

        // Validate the authorId
        if(!ObjectId.isValid(data.authorId)) {
            return res.status(400).send({status: false , msg:"Invalid Author-Id"})
         }

        if (!data.category) {
            return res.status(400).send({ status: false, msg: "Please Provide Blog category"})
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
        let author = await blogModel.create(data)
        res.status(201).send({status: true , data: author})
        
           
    } 
    catch (err) {
        res.status(500).send({status: false , error: err.message})
    }
}


const getBlogs = async function (req , res) {
    try{
        
        
        let queryData = req.query

        if(!(queryData.authorId || queryData.category || queryData.tags || queryData.subcategory ) ){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }

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
        let authorId
        if(queryData.authorId){
             authorId = await authorModel.findById(queryData.authorId)
             if(!authorId) {
                return res.status(404).send({status: false , msg:"Author not Found"})   
            }
        }
        
        
            queryData.isDeleted = false
            queryData.isPublished = true
            const blogData = await blogModel.find( queryData )
            console.log(blogData);
            if(blogData.length == 0){
                return res.status(404).send({status: false , msg: 'No Document Found'})
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
        if(! (blog.title || blog.body || blog.tags || blog.subcategory || blog.isPublished) ){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }

        let blogId = req.params.blogId

        if (Object.keys(blog).length == 0) { 
            return res.status(400).send({ status: false, msg: "Invalid request !! Please Provide Blog Details"})
          }

        if(!ObjectId.isValid(blogId)){
            return res.status(400).send({status: false , msg:"Invalid Blog-Id"})
        }

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
        let blogId = data.params.blogId
        if(!ObjectId.isValid(blogId)){
            return res.status(400).send({status: false , msg:"Invalid Blog-Id"})
        }

        let blogData =  await blogModel.findById(blogId)
        if(!blogData || blogData.isDeleted == true){
            res.status(404).send({status: false , msg: "Data Not Found"})
        }
      
        blogData.isDeleted = true
        blogData.deletedAt = new Date().toISOString()
        await blogData.save()
        res.status(200).send()

        
        
    } catch (err) {
        res.status(500).send({status: false , error: err.message}) 
    }
}

const deleteByQuery =  async function ( req , res) {

    try {
        //category, authorid, tag name, subcategory name, unpublished
        let blog = req.query
        if(!(blog.category ||blog.authorId || blog.tags || blog.subcategory || blog.isPublished)){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }

        if(blog.category == '' || typeof(blog.category) != String){
            return res.status(400).send( {status: false , msg: 'category is Invalid'})
        }
        if(blog.authorId == '' || !(ObjectId.isValid(blog.authorId))){
            return res.status(400).send( {status: false, msg: 'authorId is Invalid'})
        }

        let tagsArr = blog.tags
        if(tagsArr.length == 0 || Array.isArray(tagsArr) || function check(tagsArr) {
            return tagsArr.every(i => (typeof i === "string"));
        } == false){
            res.status(400).send({ status: false , msg: 'tags are Invalid'})
        }

        let subCatArr = blog.subcategory
        if(subCatArr.length == 0 || Array.isArray(subCatArr) || !function check(subCatArr) {
            return subCatArr.every(i => (typeof i === "string"));
        } == false){
            res.status(400).send({ status: false , msg: 'subcategory must be present'})
        }

        if(typeof(blog.isPublished) != Boolean){
            res.status(400).send( { status: false , msg: 'isPublished is Invalid'})
        }
        blog.isDeleted = false
        const blogData = await blogModel.find( blog )

        if(!blogData.length || blogData.isDeleted == true){
            return res.status(404).send({status: false , msg: 'Data not found'})
        }
        blogData.isDeleted = true
        await blogData.save()
        return res.status(200).send()
        

    } catch (err) {
        res.status(500).send({status: false , error: err.message})    
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleteByBlogId = deleteByBlogId
module.exports.deleteByQuery = deleteByQuery