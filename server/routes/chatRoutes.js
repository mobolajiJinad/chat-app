const express = require("express");
const { StatusCodes } = require("http-status-codes");

const User = require("../model/User");
const Chat = require("../model/Chat");

const router = express.Router();

router.route("/:param").get(async (req, res) => {
  try {
    const { param } = req.params;
    const { userID } = req.user;

    const [otherParticipantID, chatID] = param.split("&&&");

    const [otherParticipant, chat] = await Promise.all([
      User.findById(otherParticipantID),
      Chat.findById(chatID),
    ]);

    const messages = chat?.messages || [];
    const IDs = { userID, otherParticipantID };
    const otherParticipantData = {
      username: otherParticipant.username,
      profilePic: otherParticipant.profilePicture,
    };

    res.status(StatusCodes.OK).json({ otherParticipantData, IDs, messages });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
