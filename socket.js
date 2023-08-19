const Message = require("./model/Message");
const Chat = require("./model/Chat");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("joinChat", (chatID) => {
      socket.join(chatID);

      socket.broadcast.to(chatID).emit("status", "online");

      socket.on("chatMessage", async (msg) => {
        const chat = await Chat.findById(chatID).lean();

        if (!chat) {
          await Chat.create({
            _id: chatID,
            participants: [
              {
                _id: msg.id.userID,
              },
              {
                _id: msg.id.otherParticipantID,
              },
            ],
            messages: [],
          });
        }

        try {
          const newMessage = await Message.create({
            from: msg.id.userID,
            to: msg.id.otherParticipantID,
            messageText: msg.msg,
          });

          await Chat.updateOne(
            { _id: chatID },
            { $push: { messages: newMessage }, $inc: { unreadMessages: 1 } }
          );

          socket.broadcast.to(chatID).emit("message", msg.msg);
        } catch (err) {
          console.error(err);
        }
      });

      socket.on("seen", async () => {
        try {
          await Chat.updateOne(
            { _id: chatID },
            { $set: { unreadMessages: 0 } }
          );
        } catch (err) {
          console.error(err);
        }
      });

      socket.on("disconnect", () => {
        socket.broadcast.to(chatID).emit("status", "offline");
        console.log("Client disconnected");
      });
    });
  });

  return io;
};
