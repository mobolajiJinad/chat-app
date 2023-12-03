const express = require("express");
const { StatusCodes } = require("http-status-codes");

const User = require("../model/User");

const router = express.Router();

router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ error: "Provide both username and password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid username or password" });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid username or password" });
    }

    const token = user.generateJWT();
    return res.status(StatusCodes.OK).json({ token });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

router.route("/signup").post(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ error: "Provide both username and password" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ error: "Username already exists" });
    }

    const newUser = new User({ username, password });
    const token = newUser.generateJWT();
    await newUser.save();

    return res.status(StatusCodes.OK).json({ token });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

module.exports = router;
