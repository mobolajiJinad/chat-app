const express = require("express");

const User = require("../model/User");

const router = express.Router();

router.route("/").get((req, res) => {
  res.redirect("/chat");
});

router.route("/contacts/getList").post(async (req, res) => {
  const { userID } = req.body;

  const users = await User.find(
    { _id: { $ne: userID } },
    "username profilePicture"
  );
  const otherUsersData = users.map((user) => {
    return {
      username: user.username,
      otherParticipantID: user._id,
      profilePic: user.profilePicture,
    };
  });

  res.status(200).json({ otherUsersData });
});

module.exports = router;
