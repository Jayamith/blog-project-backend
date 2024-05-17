const jwt = require('jsonwebtoken');
const User = require('../model/User/User');


const isLoggedIn = (req, res, next) => {
    // Get token from the header
    const token = req.headers.authorization?.split(' ')[1];

    //? Verify the token
    jwt.verify(token, 'fgghdrtstyse3$^$#$@DDAFgdggzsdfsxd.//fyts4', async (err, decoded) => {
        
        const userId = decoded?.user?.id;

        const user = await User.findById(userId).select("username email role _id");

        req.userAuth = user;

        if(err) {
            return 'Invalid Token';
        } else {
            //* Save the user
            //! send the user
            next();
        }
    });
}

module.exports = isLoggedIn;