const express = require("express");
const { StatusCodes } = require("http-status-codes");

const User = require("../model/User");
const Chat = require("../model/Chat");

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const { userID } = req.user;

    const [user, chats] = await Promise.all([
      User.findById(userID),
      Chat.find({ participants: { $in: userID } }).populate({
        path: "participants",
        select: "username _id",
        match: { _id: { $ne: userID } },
      }),
    ]);

    const otherUsers = await User.find({ _id: { $ne: userID } }, "profilePicture");

    const data = await Promise.all(
      chats.map(async (chat) => {
        const otherParticipant = chat.participants[0];

        const profilePic = otherUsers.find(
          (user) => user._id.toString() === otherParticipant._id.toString()
        ).profilePicture;

        const lastMessage = chat.messages.pop().messageText;

        return {
          id: chat._id,
          otherParticipantUsername: otherParticipant.username,
          otherParticipantID: otherParticipant._id,
          unreadMessages: chat.unreadMessages,
          profilePic,
          timeLastMessage: new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          lastMessage:
            lastMessage.length <= 23 ? lastMessage : `${lastMessage.slice(0, 21)}...`,
        };
      })
    );

    const username = user.username;

    return res.status(StatusCodes.OK).json({ username, userID, data });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});

router.route("/getAll").post(async (req, res) => {
  try {
    const { userID } = req.body;

    const users = await User.find({ _id: { $ne: userID } }, "username profilePicture");

    const otherUsersData = users.map((user) => {
      return {
        otherParticipantUsername: user.username,
        otherParticipantID: user._id,
        otherParticipantProfilePic: user.profilePicture,
      };
    });

    res.status(StatusCodes.OK).json({ otherUsersData });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
