const CollegeModel = require("../models/College Model")


const createCollege = async function (req, res) {
  try {
    const data = req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Data is required" })
    let regex = /^[a-zA-Z ]{2,30}$/
    let regex1 = /^[a-zA-Z, ]{2,100}$/
    let linkregex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    //let linkregex=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
    if (!data.name) return res.status(400).send({ status: false, message: "name is required" })
    if (!data.fullName) return res.status(400).send({ status: false, message: "fullName is required" })
    if (!data.logoLink) return res.status(400).send({ status: false, message: "Logolink is required" })

    // Regex Validation is used here======================= 

    if (!regex.test(data.name)) return res.status(400).send({ status: false, message: "NAME SHOULD ONLY CONTAIN ALPHABETS AND LENGTH MUST BE IN BETWEEN 2-30" })
    if (!regex1.test(data.fullName)) return res.status(400).send({ status: false, message: "FULLNAME SHOULD ONLY CONTAIN ALPHABETS AND LENGTH MUST BE IN BETWEEN 2-100" })
    if (!linkregex.test(data.logoLink)) return res.status(400).send({ status: false, message: "LINK SHOULD BE A VALID S3 URL" })
    if (data.isDeleted == true) return res.status(400).send({ status: false, message: "CANT DELETE BEFORE CREATION" })

    // clg name is same 
    let duplicate = await CollegeModel.findOne({ name: data.name })
    if (duplicate) { return res.status(400).send({ status: false, message: " colege NAME is ALREADY EXISTS" }) }

    // creating clg
    const createData = await CollegeModel.create(data)
    res.status(201).send({ status: true, Data: createData })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}


module.exports.createCollege = createCollege
