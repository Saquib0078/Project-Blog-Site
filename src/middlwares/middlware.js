const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel.js");
const blogModel = require("../models/BlogModel.js")



const authenticate = function(req, res, next) {
try{
    let token = req.headers["x-api-key"]
    if(!token) return res.status(400).send({status:false, msg:"token is needed"})
   let validToken = jwt.verify(token,"blog-site-project-01")
    if (!validToken) return res.status(400).send({status: false, msg: "token is Invalid"}) 
    next()
} catch(error) {
    return res.status(400).send(error.message);
}

}

const authorise =async function(req, res, next) {
    try {
      let token = req.headers["x-api-key"]
      let decodeToken = jwt.verify(token,"blog-site-project-01")
      
      let userToBeModified = req.params.blogId
      let userLoggedIn = await blogModel.findById(userToBeModified)
      if( userLoggedIn.authorId != decodeToken.authorId )
      return res.status(400).send({status:false, msg:"you are not authorize for changes"})
      next()
    } catch (error) {
        return res.status(400).send(error.message);
    }
   
} 

module.exports.authenticate = authenticate
module.exports.authorise = authorise

