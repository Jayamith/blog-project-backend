const express =  require('express');
const { register, login, profile } = require('../../controllers/users/userController');

const userRouter =  express.Router();

//!Register
userRouter.post('/register', register);
//!Login
userRouter.post('/login', login);
//!Profile
userRouter.get('/profile/', profile);


module.exports = userRouter;