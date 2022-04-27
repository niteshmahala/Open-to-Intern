const blogModel = require('../models/blogModel')
const authorModel = require('../models/authorModel')
const mongoose = require('mongoose');


const createBlog = async function (req , res) {

    try {
        
        let data = req.body
        
        if(!mongoose.Types.ObjectId.isValid(data.authorId)) {
           return res.status(400).send({status: false , msg:"Invalid Author-Id"})
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

        if(!(queryData.authorId || queryData.category || queryData.tags || queryData.subcategory) ){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }
        if(!mongoose.Types.ObjectId.isValid(queryData.authorId)) {
            return res.status(400).send({status: false , msg:"Invalid Author-Id"})
         }

         let authorId = await authorModel.findById(queryData.authorId)

         if(!authorId) {
            return res.status(400).send({status: false , msg:"Invalid Author-Id"})   
        }
        
        if(authorId){
            const blogData = await blogModel.find({ queryData , isDeleted: false , isPublised: true} )
            if(blogData.length == 0){
                return res.status(404).send({status: false , msg: 'No Document Found'})
            } 
            return res.status(200).send({status: true , Data: blogData})
        }

    }
    catch(err){
        res.status(500).send({status: false , error: err.message})
    }

}

const updateBlogs = async function ( req , res) {
    try {
        let blog = req.body
        if(! (blog.title || blog.body || blog.tags || blog.subcategory) ){
            return res.status(400).send( {status: false , msg: "Invalid Filters"})
        }

        let blogId = req.params.blogId

        if(!mongoose.Types.ObjectId.isValid(blogId)){
            return res.status(400).send({status: false , msg:"Invalid Blog-Id"})
        }
        let blogData = await blogModel.findById(blogId)
        if(!blogData){
            res.status(404).send({status: false , msg: "Data Not Found"})
        }
        if(blogData.isDeleted == true){
            return res.status(404).send({status: false , msg: "Data not Found"})
        }

        if(blogData.isPublished == false){
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

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs