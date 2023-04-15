const User = require("../model/Chat");
const Chat = require("../model/Chat");

const chatController = async (req, res) => {
  const { id } = req.params;
  const { userID } = req.user;
  const { otherParticipantID } = req.body;

  const user = await User.findById(userID);
  const otherParticipant = await User.findById(otherParticipantID);
  const chat = await Chat.findById(id);

  if (!chat) {
    const newChat = await Chat.create({
      _id: id,
      participants: [
        {
          _id: userID,
        },
        {
          _id: otherParticipantID,
        },
      ],
    });
  }

  if (chat) {
    console.log(chat);
  }

  const otherParticipantUsername = otherParticipant.username;

  res.render("chat", {
    title: "Chat",
    otherParticipantUsername,
    msg: { error: req.flash("error"), success: req.flash("success") },
  });
};

module.exports = chatController;
