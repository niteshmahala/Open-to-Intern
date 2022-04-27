
   
const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController = require('../controllers/blogController')

router.post("/authors", authorController.createAuthor)
router.post('/blogs', blogController.createBlog)
router.get('/blogs' , blogController.getBlogs)
router.put('/blogs/:blogId', blogController.updateBlogs)
router.delete('/blogs/:blogId', blogController.deleteByBlogId)


module.exports = router;