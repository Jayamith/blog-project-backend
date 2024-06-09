const Post = require("../../model/Post/Post");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const Category = require("../../model/Category/Category");

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, categoryId } = req.body;

  const postExists = await Post.findOne({ title });

  if (postExists) {
    throw new Error("Post Already Exists!");
  }

  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });

  // * Assign to User
  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  // * Assign to Category
  await Category.findByIdAndUpdate(
    categoryId,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Post Created Successfully!",
    post,
  });
});

exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("comments");

  res.status(200).json({
    status: "success",
    message: "Post List Retrieved Successfully!",
    posts,
  });
});

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("comments");

  res.status(200).json({
    status: "success",
    message: "Post Retrieved Successfully!",
    post,
  });
});

exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Post Deleted Successfully!",
  });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Post Updated Successfully!",
    post,
  });
});

exports.likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userId = req.userAuth?._id;

  const post = await Post.findById(id);

  if (!post) {
    throw new Error("Post Not Found!");
  }

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: userId },
    },
    {
      new: true,
    }
  );

  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString !== userId.toString
  );

  res.status(200).json({
    status: "success",
    message: "Post Liked Successfully!",
    post,
  });
});
