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
    image: req?.file?.path,
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
  //! find all users who have blocked the logged in user
  const loggedInUser = req.userAuth?._id;
  const currentTime = new Date();

  const usersWhoBlockedCurrentUser = await User.find({
    blockedUsers: loggedInUser,
  });

  // * Get thoses user ids
  const blockingUsersIds = usersWhoBlockedCurrentUser?.map((user) => user?._id);

  const posts = await Post.find({
    author: { $nin: blockingUsersIds },
    $or: [
      {
        scheduledPublish: { $lte: currentTime },
        scheduledPublish: null,
      },
    ],
  })
    .populate({
      path: "author",
      model: "User",
      select: "username email role",
    })
    .populate("category");

  res.status(200).json({
    status: "success",
    message: "Post List Retrieved Successfully!",
    posts,
  });
});

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("comments")
    .populate("author")
    .populate("category");

  res.status(200).json({
    status: "success",
    message: "Post Retrieved Successfully!",
    post,
  });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const postFound = await Post.findById(req.params.id);

  const isAuthor =
    req.userAuth?._id?.toString() === postFound?.author?._id?.toString();

  if (!isAuthor) {
    throw new Error("Action Denied!, You are not the author of this post");
  }
  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Post Deleted Successfully!",
  });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const postFound = await Post.findById(id);

  if (!postFound) {
    throw new Error("Post not found!");
  }

  const { title, category, content } = req.body;

  const post = await Post.findByIdAndUpdate(
    id,
    {
      image: req?.file?.path ? req?.file?.path : postFound?.image,
      title: title ? title : postFound?.title,
      category: category ? category : postFound?.category,
      content: content ? content : postFound?.content,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Post Updated Successfully!",
    post,
  });
});

exports.getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category");

  res.status(200).json({
    status: "success",
    message: "Posts Fetched Successfully!",
    posts,
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
  await post.save();

  res.status(200).json({
    status: "success",
    message: "Post Liked Successfully!",
    post,
  });
});

exports.dislikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userId = req.userAuth?._id;

  const post = await Post.findById(id);

  if (!post) {
    throw new Error("Post Not Found!");
  }

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { dislikes: userId },
    },
    {
      new: true,
    }
  );

  post.likes = post.likes.filter((like) => like.toString !== userId.toString);
  await post.save();

  res.status(200).json({
    status: "success",
    message: "Post Disliked Successfully!",
    post,
  });
});

exports.clapPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new Error("Post Not Found!");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $inc: { claps: 1 },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Post Clapped Successfully!",
    updatedPost,
  });
});

exports.scheduledPost = asyncHandler(async (req, res) => {
  const { schedulePublish } = req.body;
  const { postId } = req.params;

  if (!postId || !schedulePublish) {
    throw new Error("Post ID and schedule date are required!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post Not Found!");
  }

  if (post.author?.toString() !== req.userAuth?._id) {
    throw new Error("You can schedule your own posts only!");
  }

  const scheduleDate = new Date(schedulePublish);
  const currentDate = new Date();

  if (scheduleDate < currentDate) {
    throw new Error("Schedule publish day cannot be in the past!");
  }

  post.scheduledPublish = schedulePublish;
  await post.save();

  res.status(200).json({
    status: "success",
    message: "Post Scheduled Successfully!",
    post,
  });
});

exports.postViewCount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userId = req.userAuth?._id;

  const post = await Post.findById(id);

  if (!post) {
    throw new Error("Post Not Found!");
  }

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { postViews: userId },
    },
    {
      new: true,
    }
  );

  await post.save();

  res.status(200).json({
    status: "success",
    message: "Post Viewed Successfully!",
    post,
  });
});
