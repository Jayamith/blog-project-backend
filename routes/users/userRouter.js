const express =  require('express');
const { register, login, profile } = require('../../controllers/users/userController');
const isLoggedIn = require('../../middlewares/isLoggedIn');

const userRouter =  express.Router();

//*Register
userRouter.post('/register', register);
//*Login
userRouter.post('/login', login);
//*Profile
userRouter.get('/profile/', isLoggedIn, profile);


module.exports = userRouter;