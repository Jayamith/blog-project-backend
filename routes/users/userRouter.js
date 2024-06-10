const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  profile,
  blockUser,
  unblockUser,
  viewProfile,
  followUser,
  unFollowUser,
  forgetPassword,
  resetPassword,
  accountVerificationEmail,
} = require("../../controllers/users/userController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const storage = require("../../utils/fileUpload");

const userRouter = express.Router();

//! file upload middleware
const upload = multer({ storage });

//*Register
userRouter.post("/register", upload.single("profilePicture"), register);
//*Login
userRouter.post("/login", login);
//*Profile
userRouter.get("/profile/", isLoggedIn, profile);
//*Block User
userRouter.put("/block/:blockUserId", isLoggedIn, blockUser);
//*UnBlock User
userRouter.put("/unblock/:unblockUserId", isLoggedIn, unblockUser);
//*Forgot Password
userRouter.put("/forget-password", forgetPassword);
//*Account Verification Email
userRouter.put(
  "/account-verification-email",
  isLoggedIn,
  accountVerificationEmail
);
//*Account Verification
userRouter.put(
  "/account-verification/:verifyToken",
  isLoggedIn,
  accountVerificationEmail
);
//*Reset Password
userRouter.put("/reset-password/resetToken", resetPassword);
//*View Profile
userRouter.get("/view_profile/:viewUserId", isLoggedIn, viewProfile);
//*Follow User
userRouter.put("/following/:followUserId", isLoggedIn, followUser);
//*Unfollow User
userRouter.put("/unfollowing/:unfollowUserId", isLoggedIn, unFollowUser);

module.exports = userRouter;
