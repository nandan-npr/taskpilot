const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  return jwt.sign(
    {
      userId: userId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters."
      });
    }

    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({
      email: email
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};