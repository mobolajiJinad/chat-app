const Chat = require("../model/Chat");
const Message = require("../model/Message");

const deleteChatController = async (req, res) => {
  const { param } = req.params;
  const [otherParticipantID, chatID] = param.split("&&&");

  await Chat.findByIdAndDelete(chatID);
  // const messages = await Message.find();

  // console.log(messages);
  res.redirect("/chat");
};

module.exports = deleteChatController;
