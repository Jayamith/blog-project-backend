const express = require("express");
const multer = require("multer");
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
const storage = require("../../utils/fileUpload");

const postRouter = express.Router();

//! file upload middleware
const upload = multer({ storage });

//*Create Post
postRouter.post("/", isLoggedIn, upload.single("file"), createPost);

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
