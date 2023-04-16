const User = require("../model/User");
const Chat = require("../model/Chat");

const getChatList = async (req, res) => {
  const { userID } = req.user;

  const user = await User.findById(userID);
  const chats = await Chat.find({ participants: { $in: userID } }).populate({
    path: "participants",
    select: "username _id",
    match: { _id: { $ne: userID } },
  });

  const data = chats.map((chat) => ({
    id: chat._id,
    otherParticipantUsername: chat.participants[0].username,
    otherParticipantID: chat.participants[0]._id,
    unreadMessages: chat.unreadMessages,
  }));

  const username = user.username;

  res.render("chat-list", {
    title: "Chat List",
    username,
    userID,
    data,
    msg: { error: req.flash("error"), success: req.flash("success") },
  });
};

module.exports = getChatList;
