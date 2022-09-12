const authorModel=require("../models/authorModel.js")
const jwt = require("jsonwebtoken")




// create author ---------------------------------------
const createAuthor= async function (req,res){
    try {
//getting datanfrom body and saved inside a variable data
      let data =req.body   
  //checking data inside body Object if the input is empty or not
    if(Object.keys(data).length != 0 ){
      //getting email from request body and validating it
    let validateEmail = data.email
    if(!validateEmail)  return res.status(400).send({msg: "Email is required"})
    // creating new author in database
    let savedData=await authorModel.create(data)
    res.status(201).send ({status:true,data: savedData})
   }  else  {
       return res.status(400).send({msg: "Input is missing"}) }}
    catch (error){
        res.status(500).send(error.message)
    }
}




// login ----------------------------------------------------------------------

const loginUser = async function(req,res){

   
  try {
    let data = req.body
    // getting email and password in request body and checking if its not empty
    if(Object.keys(data) != 0 && data.email && data.password)
    {
    
      let UserId = data.email
      let password = data.password
      //Going to authormodel and checking inside the database that if email and password exists
      let validUser = await authorModel.findOne({email:UserId, password:password})
      if(!validUser) return res.status(400).send({msg:"Incorrect Email or Password"})
       if(Object.keys(validUser).length != 0){
        // using Jwt package and creating the unique token with secret key
          let token = jwt.sign({authorId: validUser._id.toString()},"blog-site-project-01")
         return res.status(201).send({status:true, data:token})
          
       } else {
           return res.status(404).send({status:false, msg: "user not found"})
       }
    }else {
    return res.status(400).send({status:false, msg:"Request body must not be empty"})
   

    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}


module.exports.createAuthor=createAuthor
module.exports.loginUser = loginUser