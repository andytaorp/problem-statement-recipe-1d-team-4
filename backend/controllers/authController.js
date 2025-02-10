const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.login(email, password);
    const token = createToken(user._id);

    return res.status(200).json({ email, token }); // ✅ Always return JSON
  } catch (error) {
    console.error("Login Error:", error);

    if (!res.headersSent) {
      return res.status(400).json({ error: error.message || "Login failed" });
    }
  }
};


// Signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.signup(email, password);
    const token = createToken(user._id);

    return res.status(201).json({ email, token }); // ✅ Always return JSON
  } catch (error) {
    console.error("Signup Error:", error);

    if (!res.headersSent) {
      return res.status(400).json({ error: error.message || "Signup failed" });
    }
  }
};




module.exports = { loginUser, signupUser };
