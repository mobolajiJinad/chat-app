const express = require("express");
const { StatusCodes } = require("http-status-codes");

const User = require("../model/User");

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const { userID } = req.user;
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});

router.route("/existingContacts").get(async (req, res) => {});

module.exports = router;
