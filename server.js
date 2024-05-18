const dotenv = require("dotenv");
dotenv.config();

const http = require('http');
const express = require('express');
const userRouter = require('./routes/users/userRouter');
const { notFoundError, globalErrHandler } = require('./middlewares/globalErrorHandler');
const categoryRouter = require('./routes/categories/categoryRouter');
require('./config/database')();

//!Server
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);

// ? Not Found Middleware
app.use(notFoundError);

//! Error Handeling Middleware
app.use(globalErrHandler);

const server = http.createServer(app);

//? Start the server
const PORT = process.env.PORT || 9080

server.listen(PORT, console.log(`Server is running on port ${PORT}`));
