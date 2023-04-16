const Message = require("./model/Message");
const Chat = require("./model/Chat");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", (chatID) => {
      socket.join(chatID);

      socket.broadcast.emit("status", "online");

      socket.on("chatMessage", async (msg) => {
        const chat = await Chat.findById(chatID).lean();
        const to = chat.participants.find((otherID) => otherID !== msg.id);

        try {
          const newMessage = await Message.create({
            from: msg.id,
            to: to,
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
        socket.broadcast.emit("status", "offline");
        console.log("Client disconnected");
      });
    });
  });

  return io;
};
