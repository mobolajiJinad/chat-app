const express = require("express");
const uuid = require("uuid");

const User = require("../model/User");

const router = express.Router();

router.route("/").get((req, res) => {
  res.redirect("/chat");
});

router.route("/contacts/getList").post(async (req, res) => {
  const { userID } = req.body;

  const users = await User.find({ _id: { $ne: userID } }, "username");
  const otherUsersData = users.map((user) => {
    return {
      username: user.username,
      otherParticipantID: user._id,
    };
  });

  res.status(200).json({ otherUsersData });
});

router.route("/saveMessage").post(async (req, res) => {});

module.exports = router;
