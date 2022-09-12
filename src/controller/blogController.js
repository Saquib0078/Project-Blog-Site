const authorModel = require("../models/authorModel.js");
const blogModel = require("../models/BlogModel.js");


// create Blog |----------------------------------------------------------------
const createBlog = async function (req, res) {
  try {
   
    let data = req.body;
    if (Object.keys(data).length != 0) {
      let authorId = data.authorId;  //taking author id from request body
      // taking data in post body and creating new blog 

         //if no author id present in request body
      if (!authorId)
        return res.status(400).send({status:false, msg: "authorId is required" });
      else {
        //Executes when objectId is valid but author not found
        let validAuthor = await authorModel.findOne({ _id: authorId }); 
        if (!validAuthor) return res.status(400).send({ status:false,msg: " authorId is not valid" });
      }
     
      let savedData = await blogModel.create(data);
      res.status(201).send({ msg: savedData });
    } else {
      return res.status(404).send({status:false, msg: "Input is missing" });
    }
  } catch (error) {
    res.status(500).send( error);
  }
};



// get Blogs |----------------------------------------------------------------
let getAllBlog = async function (req, res) {
  try {
    let data = req.query;
    // finding the values in Db and populating document with author details
    let getBlogs = await blogModel.find({ isPublished: true, isDeleted: false, ...data }).populate("authorId");
    res.status(201).send({status:true, data: getBlogs });
    //checking if we are getting some documents from the database in response
    if (getBlogs.length == 0)
      return res.status(404).send({ status:false,msg: "no such blog exist" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// put Blogs |----------------------------------------------------------------

let UpdateBlog = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length != 0) {
     // taking blogId as input and saving it inside a variable
      let blogId = req.params.blogId;
      //finding blogId inside Db
      let findBlogId = await blogModel.findById(blogId);
      if (!blogId)
        return res
          .status(404)
          .send({ status: false, msg: "no such BlogId exists" });
    
        //going to blogmodel and updating data
        let updatedBlog = await blogModel.findByIdAndUpdate(blogId, data, {
          new: true,

        });
       return res.status(201).send({ status: true, data: updatedBlog });
      
    } else {
      return res.status(404).send({ status:false,msg: "Input is missing" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// DELETE /blogs/:blogId ----------------------------------------------------------

let deleteBlog = async function (req, res) {
  try {
    //taking blogId in params and saving in variable id
    let id = req.params.blogId;
    let blogId = await blogModel.findById(id);
    // 
    // CHECKING BLOG ID iS EXIST OR NOT
    if (!blogId)
      return res.status(404).send({ status: false, msg: "blog id doesn't exists" });
    let timestamps = new Date();
    await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isDeleted: true, isPublished: false, deletedAt: timestamps }
    );
    res.status(201).send({ status: true, msg: "blog Deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE /blogs?queryParams --------------------------------------------------

let deleteBlogs = async function (req, res) {
  try {
    const queryParams = req.query;
    if (Object.keys(queryParams).length == 0)
        return res.status(400).send({ status: false, msg: "Input is missing" });

  
    const updatedBlog = await blogModel.updateMany(queryParams, { $set: { isDeleted: true, isPublished: false } }, { new: true });
    return res.status(201).send({ status: true, data: updatedBlog })
}
catch (error) {
     res.status(500).send(error.message)
}
}


// ------------------- EXPORTING MODULE TO ROUTE.JS -----------------------------------------------------

module.exports.createBlog = createBlog;   // CREATE BLOG
module.exports.getAllBlog = getAllBlog;   // GET BLOGS
module.exports.UpdateBlog = UpdateBlog;   // UPDATE BLOGS
module.exports.deleteBlog = deleteBlog;   // DELETE BLOG BY PARAMS
module.exports.deleteBlogs = deleteBlogs; // DELETE BLOG BY QUERY PARAMS
