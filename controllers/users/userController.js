const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const sendEmail = require("../../utils/sendEmail");
const sendAccVerificationEmail = require("../../utils/sendAccVerificationEmail");

// @desc register a new user
// @route api/v1/users/register
// @access public

exports.register = asyncHandler(async (req, res) => {
  // get the details
  const { username, password, email } = req.body;

  // !Check whether user exists
  const user = await User.findOne({ username });

  if (user) {
    throw new Error("User Already Exists");
  }

  //Register new user
  const newUser = new User({
    username,
    email,
    password,
  });

  //! hash password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  //save
  await newUser.save();
  res.status(201).json({
    status: "Success",
    message: "User Registered Successfully",
    newUser,
  });
});

// @desc login user
// @route api/v1/users/login
// @access public

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  //!Check whether user exists
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid login credentials");
  }

  //*Compare the hash password with the one coming in request
  const isMatched = await bcrypt.compare(password, user?.password);

  if (!isMatched) {
    throw new Error("Invalid login credentials");
  }

  //*Update last login
  user.lastLogin = new Date();
  await user.save();
  res.json({
    status: "success",
    email: user?.email,
    _id: user?._id,
    username: user?.username,
    role: user?.role,
    token: generateToken(user),
  });
});

// @desc user profile
// @route api/v1/users/profile/:id
// @access private

exports.profile = asyncHandler(async (req, res, next) => {
  const Id = req.userAuth?._id;
  const user = await User.findById(Id);
  res.json({
    status: "success",
    message: "Get Profile",
    user,
  });
});

exports.blockUser = asyncHandler(async (req, res) => {
  const currentUserId = req.userAuth?._id;
  const blockingUserId = req.params.blockUserId;

  const userToBlock = await User.findById(blockingUserId);

  if (!userToBlock) {
    throw new Error("No User Found to Block");
  }

  if (currentUserId.toString() === blockingUserId.toString()) {
    throw new Error("Can not block yourself");
  }

  const currentUser = await User.findById(currentUserId);

  if (currentUser?.blockedUsers?.includes(blockingUserId)) {
    throw new Error("User already blocked!");
  }

  currentUser?.blockedUsers.push(blockingUserId);

  await currentUser.save();

  res.json({
    status: "success",
    message: "User Blocked Successfully!",
  });
});

exports.unblockUser = asyncHandler(async (req, res) => {
  const currentUserId = req.userAuth?._id;
  const unblockingUserId = req.params.unblockUserId;

  const userToBeUnBlock = await User.findById(unblockingUserId);

  if (!userToBeUnBlock) {
    throw new Error("No User Found to Be UnBlocked!");
  }

  const currentUser = await User.findById(currentUserId);

  if (!currentUser?.blockedUsers?.includes(unblockingUserId)) {
    throw new Error("User not blocked!");
  }

  currentUser?.blockedUsers ==
    currentUser?.blockedUsers.filter(
      (id) => id.toString() !== unblockingUserId.toString()
    );

  await currentUser.save();

  res.json({
    status: "success",
    message: "User UnBlocked Successfully!",
  });
});

exports.viewProfile = asyncHandler(async (req, res) => {
  const currentUserId = req.userAuth?._id;
  const viewingUserId = req.params.viewUserId;

  const userProfile = await User.findById(viewingUserId);

  const currentUser = await User.findById(currentUserId);

  userProfile.profileViewers.push(currentUserId);

  await userProfile.save();

  res.json({
    status: "success",
    message: "You have Viewed profile Successfully!",
  });
});

exports.followUser = asyncHandler(async (req, res) => {
  const currentUserId = req.userAuth?._id;
  const userToFollowId = req.params.followUserId;

  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId },
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId },
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "User Following Successful!",
  });
});

exports.unFollowUser = asyncHandler(async (req, res) => {
  const currentUserId = req.userAuth?._id;
  const userToUnfollowId = req.params.unfollowUserId;

  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnfollowId },
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    userToUnfollowId,
    {
      $pull: { followers: currentUserId },
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "User Unfollowed Successfully!",
  });
});

exports.forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userFound = await User.findOne({ email });

  if (!userFound) {
    throw new Error("No Such User Found!");
  }

  // create token
  const resetToken = await userFound.generatePasswordResetToken();

  await userFound.save();

  sendEmail(email, resetToken);

  res.status(200).json({
    message: "Password Reset Email Sent!",
    resetToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  // convert token to actual token which is in db

  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!userFound) {
    throw new Error("Password Reset Token is Invalid or Expired!");
  }

  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);
  userFound.passwordResetToken = undefined;
  userFound.passwordResetExpires = undefined;

  await userFound.save();

  res.status(200).json({
    message: "Password Reset Successful!",
  });
});

exports.accountVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.userAuth?._id);
  if (!user) {
    throw new Error("No User Found!");
  }

  const token = await user.generateAccVerificationToken();

  await user.save();

  sendAccVerificationEmail(user?.email, token);

  res.status(200).json({
    message: `Account Verification Email sent to ${user?.email} `,
  });
});

exports.verifyAccount = asyncHandler(async (req, res) => {
  const { verifyToken } = req.params;

  // convert token to actual token which is in db
  const cryptoToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });

  if (!userFound) {
    throw new Error("Account Verification Token is Invalid or Expired!");
  }

  userFound.isVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationExpires = undefined;

  await userFound.save();

  res.status(200).json({
    message: "Account Verification Successful!",
  });
});
