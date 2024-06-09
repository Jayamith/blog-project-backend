const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
  likePost,
  dislikePost,
  clapPost,
  scheduledPost,
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

//*Like post
postRouter.put("/likes/:id", isLoggedIn, likePost);

//*Dislike post
postRouter.put("/dislikes/:id", isLoggedIn, dislikePost);

//*Clap post
postRouter.put("/claps/:id", isLoggedIn, clapPost);

//*Post Schedule
postRouter.put("/schedule/:postId", isLoggedIn, scheduledPost);

module.exports = postRouter;
