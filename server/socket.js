const Message = require("./model/Message");
const Chat = require("./model/Chat");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Someone connected");

    socket.on("joinChat", (chatID) => {
      socket.join(chatID);

      socket.broadcast.to(chatID).emit("status", "online");

      socket.on("chatMessage", async (msg) => {
        console.log("here 2");
        const chat = await Chat.findById(chatID).lean();

        if (!chat) {
          await Chat.create({
            _id: chatID,
            participants: [
              {
                _id: msg.id.userID,
              },
              { _id: msg.id.otherParticipantID },
            ],
            messages: [],
          });
        }

        try {
          const newMessage = await Message.create({
            messageID: msg.messageID,
            from: msg.id.userID,
            to: msg.id.otherParticipantID,
            messageText: msg.chatMessage,
          });

          await Chat.updateOne({ _id: chatID }, { $push: { messages: newMessage } });

          socket.broadcast.to(chatID).emit("message", msg.messageText);
        } catch (error) {
          console.error(error);
        }
      });

      socket.on("disconnect", () => {
        socket.broadcast.to(chatID).emit("status", "offline");
        console.log("disconnected");
      });
    });
  });

  return io;
};
