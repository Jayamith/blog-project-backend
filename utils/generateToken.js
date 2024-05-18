const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    // Create  payload for the user
    const payload = {
        user:{
            id:user.id
        }
    }
    // Sign the token with secret key
    const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: 36000
    });
    return token;
}

module.exports = generateToken;