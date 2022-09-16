const CollegeModel = require('../Models/Collegemodel')
const InternModel = require('../Models/InternModel')

const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) {
        return false;
    }
    if (typeof value === "string" && value.trim().length > 0) {
        return true;
    } else {
        return false;
    }
}
const isValidRequest = function (object) {
    if (Object.keys(object).length === 0) {
        return false
    } else {
        return true
    }
}
const isValidLink = function (link) {
     const url =/(http|https):\/\/.+\.(jpg|jpeg|png)$/
  
   return url.test(link)
        
}
const isValidName = function (name) {
    const nameRegex = /^[a-z]+$/
    return nameRegex.test(name)
}

const createCollege = async function (req, res) {
    try {
        let data = req.body
        if (!isValidRequest(data)) {
            return res.status(400).send({ status: false, message: "Collage data is required" });
        }
        const { name, fullName, logoLink } = data;
        if (Object.keys(data).length > 3) {
            return res.status(400).send({ status: false, message: "invalid data entry inside request body" })
        }
        if (!isValidString(name)) {
            return res.status(400).send({ status: false, message: "Name is required" })
        }
        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: "Invalid Name" })
        }
        let checkName = await CollegeModel.findOne({name: name})
        if (checkName) {
            return res.status(400).send({ status: false, message: "College already exists" })
        }
        if (!isValidString(fullName)) {
            return res.status(400).send({ status: false, message: "Full Name is required" })
        }
        if (!isValidString(logoLink)) {
            return res.status(400).send({ status: false, message: "Please provide logolink" })
        }
        if (!isValidLink(logoLink)) {
                return res.status(400).send({ message: "Enter a valid url" })
            }
            let LogoLink = logoLink.trim() 
            req.body.logoLink=LogoLink
        
        const newCollege = await CollegeModel.create(data)
        return res.status(201).send({ status: true, data: newCollege })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
}

const collegeDetails = async function (req, res) {
    try { 
         let queryParams = req.query
        let collegeName = queryParams.collegeName
  if(collegeName)
  {
        if(!isValidRequest(queryParams)){
            return res.status(400).send({ status: false, message: "please provide queryParams"})
        }

        if (!isValidString(collegeName)) {
            return res.status(400).send({ status: false, message: "College Name is Required"})
        }
        if (!isValidName(collegeName)) {
            return res.status(400).send({ status: false, message: "Please Enter the valid College Name" })
        }

        let college = await CollegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!college) {
            return res.status(404).send({ status: false, message: "College not found" })
        }
        let collageDetails =
            {
                name: college.name,
                fullName: college.fullName,
                logolink: college.logoLink
            }
        const getCollegeId = college._id;
        const internData = await InternModel.find({ isDeleted: false, collegeId: getCollegeId }).select({ name: 1, email: 1, mobile: 1 })

        if (internData.length === 0) {
            return res.status(404).send({ status: false, message: "No college intern are found" })
        }
        const data = {
            ...collageDetails,
            interns: internData
        }
        return res.status(200).send({ status: true, data: data })
        
    }
    else
        { return res.status(400).send({status:false, message:"College name is required"})}
    
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createCollege = createCollege
module.exports.collegeDetails = collegeDetails