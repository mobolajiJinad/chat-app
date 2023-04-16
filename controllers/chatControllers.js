const User = require("../model/User");
const Chat = require("../model/Chat");

const chatController = async (req, res) => {
  const { param } = req.params;
  const { userID } = req.user;

  const [otherParticipantID, chatID] = param.split("&&&");

  if (param === "logout") {
    req.session.destroy((err) => {
      if (err) {
        return req.flash("error", "Something went wrong");
      }
      res.redirect("/auth/login");
    });
    return;
  }

  if (param === "delete") {
    await Chat.findByIdAndDelete(chatID);
  }

  const [otherParticipant, chat] = await Promise.all([
    User.findById(otherParticipantID),
    Chat.findById(chatID),
  ]);

  if (!chat) {
    await Chat.create({
      _id: chatID,
      participants: [
        {
          _id: userID,
        },
        {
          _id: otherParticipantID,
        },
      ],
      messages: [],
    });
  }

  const messages = chat?.messages || [];

  const IDs = { userID, otherParticipantID };
  const otherParticipantUsername = otherParticipant.username;

  res.render("chat", {
    title: "Chat",
    otherParticipantUsername,
    IDs,
    messages,
    msg: { error: req.flash("error"), success: req.flash("success") },
  });
};

module.exports = chatController;
