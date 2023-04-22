const User = require("../model/User");
const Chat = require("../model/Chat");

const chatController = async (req, res) => {
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

  res.render("chat", {
    title: "Chat",
    otherParticipantData,
    IDs,
    param,
    messages,
    msg: { error: req.flash("error"), success: req.flash("success") },
  });
};

module.exports = chatController;
