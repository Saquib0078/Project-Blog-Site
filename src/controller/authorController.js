const authorModel=require("../models/authorModel.js")
const jwt = require("jsonwebtoken")




// create author ---------------------------------------
const createAuthor= async function (req,res){
    try {
    let data =req.body
    if(Object.keys(data).length != 0 ){
    let validateEmail = data.email
    if(!validateEmail)
    return res.status(400).send({msg: "Email is require"})
    
    let uniqueEmail = await authorModel.findOne({email: data.email})
    if(uniqueEmail)
    return res.status(400).send({msg: "email is not unique" })
    let savedData=await authorModel.create(data)
    res.status(201).send ({msg: savedData})
   }  else  {
       return res.status(400).send({msg: "invalid request"}) }}
    catch (error){
        res.status(400).send(error.message)
    }
}




// login ----------------------------------------------------------------------

const loginUser = async function(req,res){
    try {
      let data = req.body
      if(Object.keys(data) != 0 && data.email && data.password)
      {
        let UserId = data.email
        let password = data.password
        let validUser = await authorModel.findOne({email:UserId, password:password})
         if(Object.keys(validUser).length != 0){
            let token = jwt.sign({UserId: validUser._id.toString()},"blog-site-project-01")
           return res.status(201).send({status:true, msg:token})
            
         } else {
             return res.status(400).send({status:false, msg: "user not found"})
         }
      }else {
      return res.status(400).send({status:false, msg:"invalid request"})
     
      }
    } catch (error) {
      res.status(400).send({ error: "Server Not Found" });
    }
  }
module.exports.createAuthor=createAuthor
module.exports.loginUser = loginUser