
   
const express = require('express');
const router = express.Router();
const collegecontroller= require("../controllers/collegecontroller")
const interncontroller = require('../controllers/interncontroller')
const mw = require('../middlewares/auth')

router.post("/functionup/colleges",  collegecontroller.createcollege)
router.post('/functionup/interns', interncontroller.createintern)
router.get('/functionup/collegeDetails' , interncontroller.getintern)

module.exports = router;