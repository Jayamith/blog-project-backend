const User = require("../model/User/User");

const checkAccountVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.userAuth?._id);

    if (user?.isVerified) {
      next();
    } else {
      res.status(401).json({
        message: "Account Not Verified!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error!",
      error,
    });
  }
};

module.exports = checkAccountVerification;