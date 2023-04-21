const User = require("../model/User");
const Chat = require("../model/Chat");

const getChatList = async (req, res) => {
  const { userID } = req.user;

  const [user, chats] = await Promise.all([
    User.findById(userID),
    Chat.find({ participants: { $in: userID } }).populate({
      path: "participants",
      select: "username _id",
      match: { _id: { $ne: userID } },
    }),
  ]);

  const otherUsers = await User.find(
    { _id: { $ne: userID } },
    "profilePicture"
  );

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
          lastMessage.length <= 23
            ? lastMessage
            : `${lastMessage.slice(0, 23)}...`,
      };
    })
  );

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
