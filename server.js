const http = require('http');
const express = require('express');
const userRouter = require('./routes/users/userRouter');
require('./config/database')();

//!Server
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/', userRouter);

const server = http.createServer(app);

//? Start the server
const PORT = process.env.PORT || 9080

server.listen(PORT, console.log(`Server is running on port ${PORT}`));
