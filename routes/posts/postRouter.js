const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
} = require("../../controllers/posts/postController");

const postRouter = express.Router();

//*Create Post
postRouter.post("/", isLoggedIn, createPost);

//*Get all posts
postRouter.get("/", getPosts);

//*Get post
postRouter.get("/:id", getPost);

//*Update post
postRouter.put("/:id", isLoggedIn, updatePost);

//*Delete post
postRouter.delete("/:id", isLoggedIn, deletePost);

module.exports = postRouter;
