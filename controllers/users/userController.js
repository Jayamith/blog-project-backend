const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");

// @desc register a new user
// @route api/v1/users/register
// @access public

exports.register = async (req, res) => {
  try {
    // get the details
    const { username, password, email } = req.body;

    // !Check whether user exists
    const user = await User.findOne({ username });

    if (user) {
      throw new Error("User Already Exists");
    }

    //Register new user
    const newUser = new User({
      username,
      email,
      password,
    });

    //! hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    //save
    await newUser.save();
    res.status(201).json({
      status: "Success",
      message: "User Registered Successfully",
      //   _id: newUser?._id,
      //   username: newUser?.username,
      //   email: newUser?.email,
      //   role: newUser?.role,
      newUser,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error?.message,
    });
  }
};

// @desc login user
// @route api/v1/users/login
// @access public

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //!Check whether user exists
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("Invalid login credentials");
    }

    //*Compare the hash password with the one coming in request
    const isMatched = await bcrypt.compare(password, user?.password);

    if (!isMatched) {
      throw new Error("Invalid login credentials");
    }

    //*Update last login
    user.lastLogin = new Date();
    await user.save();
    res.json({
      status: "success",
      email: user?.email,
      _id: user?._id,
      username: user?.username,
      role: user?.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error?.message,
    });
  }
};

// @desc user profile
// @route api/v1/users/profile/:id
// @access private

exports.profile = async (req, res) => {
  try {
    const Id = req.userAuth?._id;
    const user = await User.findById(Id);
    res.json({
      status: "success",
      message: "Get Profile",
      user,
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error?.message,
    });
  }
};
