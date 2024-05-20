const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");
const asyncHandler = require("express-async-handler");

exports.createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const postId = req.params.postId;

  const comment = await Comment.create({
    text,
    author: req.userAuth?._id,
    postId,
  });

  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Comment created successfully!",
    comment,
  });
});

exports.getComments = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  res.status(200).json({
    status: "success",
    message: "Category List Retrieved Successfully!",
    categories,
  });
});

exports.deleteComment= asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Comment Deleted Successfully!",
  });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      text: req.body.text,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Comment Updated Successfully!",
    comment,
  });
});
