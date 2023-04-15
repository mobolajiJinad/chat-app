const Message = require("./model/Message");
const Chat = require("./model/Chat");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", (chatID) => {
      socket.join(chatID);

      socket.broadcast.emit("status", "online");

      socket.on("chatMessage", async (msg) => {
        const chat = await Chat.findById(chatID);

        const newMessage = await Message.create({
          from: chat.participants[0],
          to: chat.participants[1],
          messageText: msg,
        });

        chat.chats.push(newMessage);
        await chat.save();

        socket.broadcast.to(chatID).emit("message", msg);
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("status", "offline");
        console.log("Client disconnected");
      });
    });
  });

  return io;
};
