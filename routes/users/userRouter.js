const express =  require('express');
const { register } = require('../../controllers/users/userController');

const userRouter =  express.Router();

//!Register
userRouter.post('/api/v1/user/register', register);

// * Export

module.exports = userRouter;