const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel.js");
const blogModel = require("../models/BlogModel.js")



// const authenticate = function(req, res, next) {
// try{
//     let token = req.headers["x-api-key"]
//     if(!token) return res.status(400).send({status:false, msg:"token is needed"})
//    let validToken = jwt.verify(token,"blog-site-project-01")
//     if (!validToken) return res.status(400).send({status: false, msg: "token is Invalid"}) 
//     next()
// } catch(error) {
//     return res.status(400).send(error.message);
// }

// }

// const authorise =async function(req, res, next) {
//     try {
//       let token = req.headers["x-api-key"]
//       let decodeToken = jwt.verify(token,"blog-site-project-01")
      
//       let userToBeModified = req.params.blogId
//       let userLoggedIn = await blogModel.findById(userToBeModified)
//       if( userLoggedIn.authorId != decodeToken.authorId )
//       return res.status(400).send({status:false, msg:"you are not authorize for changes"})
//       next()
//     } catch (error) {
//         return res.status(400).send(error.message);
//     }
   
// } 

//*********AUTHENTICATION**********/

const authenticate = async function(req,res,next){

    const token = req.headers["x-api-key"];
    
    if(!token){
        return res
            .status(400)
            .send({msg:"please provide token"});
    }

    try{
        const decodedToken = jwt.verify(token, "group18project1");

        if(!decodedToken)
        return res
            .status(401)
            .send({status:false, msg:"invalid token"});
        
        //adding a decodedToken as a property inside request object so that could be accessed in other handler and middleware of same api

        req.decodedToken = decodedToken;

        next();
    }catch(error){

        res
            .status(500)
            .send({error: error.message})

    }

};

//************AUTHORIZATION***********/

const authorise = async function (req,res){
    try{

        const blogId = req.params["blogId"];
        const decodedToken = req.decodedToken;

        const blogByBlogId = await blogModel.findOne({
            _id: blogId,
            isDeleted: false,
            deletedAt: null,
        });

        if(!blogByBlogId){
            return res
                .status(404)
                .send({status:false, message:`no blogs found by ${blogId}`});
        }

        if(decodedToken.authorId != blogByBlogId.authorId){
            return res
                .status(403)
                .send({status:false , message:"unauthorize access"});
        }

        next();

    }catch(error){

        res
            .status(500)
            .send({error: error.message})

    }
}



module.exports.authenticate = authenticate
module.exports.authorise = authorise

