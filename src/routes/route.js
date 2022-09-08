const express = require('express');
const router = express.Router();

const authorController= require("../controller/authorController.js")
const blogController=require("../controller/blogController.js")
const midd = require("../middlwares/middlware.js")


router.post("/authors",authorController.createAuthor)
router.post("/blog",midd.authenticate,blogController.createBlog)
router.get("/getAllBlog",midd.authenticate,blogController.getAllBlog)
router.put("/blogs/:blogId",midd.authenticate,midd.authorise,blogController.UpdateBlog)
router.delete("/blogs/:blogId",midd.authenticate,midd.authorise,blogController.deleteBlog)
router.delete("/blogs",midd.authenticate,midd.authorise,blogController.deleteBlogs)
router.post("/login",authorController.loginUser)


module.exports = router;