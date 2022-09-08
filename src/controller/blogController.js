const authorModel = require("../models/authorModel.js");
const blogModel = require("../models/BlogModel.js");
const jwt = require("jsonwebtoken")
// create Blog |----------------------------------------------------------------
const createBlog = async function (req, res) {
  try {
    
    let data = req.body;
    if (Object.keys(data).length != 0) {
      let authorId = data.authorId;
      let validAuthorId = await authorModel.find(data);
      if (!authorId)
        return res.status(400).send({ msg: "authorId is require" });
      else {
        let a = await authorModel.findOne({ _id: authorId });
        if (!a) return res.status(400).send({ msg: " authorId is not valid" });
      }
      if (!validAuthorId)
        return res.status(400).send({ msg: "authorId is not valid" });
      let savedData = await blogModel.create(data);
      res.status(201).send({ msg: savedData });
    } else {
      return res.status(400).send({ msg: "invalid request" });
    }
  } catch (error) {
    res.status(400).send( error.message);
  }
};



// get Blogs |----------------------------------------------------------------
let getAllBlog = async function (req, res) {
  try {
    let data = req.query;
    let getBlogs = await blogModel
      .find({ isPublished: true, isDeleted: false, ...data })
      .populate("authorId");

    res.status(201).send({ msg: getBlogs });
    if (getBlogs.length == 0)
      return res.status(404).send({ msg: "no such blog exist" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// put Blogs |----------------------------------------------------------------

let getBlog = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length != 0) {
      let blogId = req.params.blogId;
      let findBlogId = await blogModel.findById(blogId);
      if (!blogId)
        return res
          .status(400)
          .send({ status: false, msg: "no such BlogId exists" });
      let a = findBlogId.isDeleted;
      if (a)
        return res
          .status(400)
          .send({ status: false, msg: "blog is already deleted" });
      else {
        let updatedBlog = await blogModel.findByIdAndUpdate(blogId, data, {
          new: true,
        });
        res.status(200).send({ status: true, msg: updatedBlog });
      }
    } else {
      return res.status(400).send({ msg: "invalid request" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// DELETE /blogs/:blogId ----------------------------------------------------------

let deleteBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let blogId = await blogModel.findById(id);
    let deleteId = blogId.isDeleted;
    if (!blogId)
      return res.status(400).send({ status: false, msg: "blog Id not found" });
    if (deleteId)
      return res.status(400).send({ status: false, msg: "data is deleted" });
    let timestamps = new Date();
    await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isDeleted: true, isPublished: false, deletedAt: timestamps }
    );
    res.status(200).send({ status: true, msg: "blog Deleted successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// DELETE /blogs?queryParams --------------------------------------------------

let deleteBlogs = async function (req, res) {
  try {
    const queryParams = req.query;
    
    if (Object.keys(queryParams).length == 0)
        return res.status(400).send({ status: false, msg: "Please enter some data in the body" });

    const blog = await blogModel.find({ $and: [queryParams, { isDeleted: false }, { isPublished: true }] });

    if (blog.isDeleted == true || blog.length == 0)
        return res.status(404).send({msg: "Document is already Deleted "})
    
    const updatedBlog = await blogModel.updateMany(queryParams, { $set: { isDeleted: true, isPublished: false } }, { new: true });
    return res.status(200).send({ status: true, data: updatedBlog })
}
catch (err) {
     res.status(500).send({ error: err.message })
}
}





module.exports.createBlog = createBlog;
module.exports.getAllBlog = getAllBlog;
module.exports.getBlog = getBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogs = deleteBlogs;
