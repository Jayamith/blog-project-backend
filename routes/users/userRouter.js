const express =  require('express');
const { register, login, profile, blockUser, unblockUser, viewProfile, followUser, unFollowUser } = require('../../controllers/users/userController');
const isLoggedIn = require('../../middlewares/isLoggedIn');

const userRouter =  express.Router();

//*Register
userRouter.post('/register', register);
//*Login
userRouter.post('/login', login);
//*Profile
userRouter.get('/profile/', isLoggedIn, profile);
//*Block User
userRouter.put('/block/:blockUserId', isLoggedIn, blockUser);
//*UnBlock User
userRouter.put('/unblock/:unblockUserId', isLoggedIn, unblockUser);
//*View Profile
userRouter.get('/view_profile/:viewUserId', isLoggedIn, viewProfile);
//*Follow User
userRouter.put('/following/:followUserId', isLoggedIn, followUser);
//*Unfollow User
userRouter.put('/unfollowing/:unfollowUserId', isLoggedIn, unFollowUser);

module.exports = userRouter;