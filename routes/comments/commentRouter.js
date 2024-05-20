const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const { createComment, updateComment, deleteComment } = require("../../controllers/comments/commentController");

const commentRouter = express.Router();

//*Create Comment
commentRouter.post("/:postId", isLoggedIn, createComment);

// //*Get all posts
// postRouter.get("/", getPosts);

// //*Get post
// postRouter.get("/:id", getPost);

//*Update Comment
commentRouter.put("/:id", isLoggedIn, updateComment);

//*Delete Comment
commentRouter.delete("/:id", isLoggedIn, deleteComment);

module.exports = commentRouter;
