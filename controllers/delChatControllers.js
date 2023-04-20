const Chat = require("../model/Chat");
const Message = require("../model/Message");

const deleteChatController = async (req, res) => {
  const { param } = req.params;
  const [otherParticipantID, chatID] = param.split("&&&");

  const chat = await Chat.findById(chatID);
  const messagesIDs = chat.messages.map((message) => message._id);

  await Message.deleteMany({ _id: { $in: messagesIDs } });

  await Chat.deleteOne({ _id: chatID });
  res.redirect("/chat");
};

module.exports = deleteChatController;
