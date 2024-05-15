const express =  require('express');
const { register, login } = require('../../controllers/users/userController');

const userRouter =  express.Router();

//!Register
userRouter.post('/api/v1/user/register', register);
//!Login
userRouter.post('/api/v1/user/login', login);


module.exports = userRouter;