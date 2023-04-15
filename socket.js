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

        const to = chat.participants.find((otherID) => otherID !== msg.id);
        const newMessage = await Message.create({
          from: msg.id,
          to: to,
          messageText: msg.msg,
        });

        chat.messages.push(newMessage);
        await chat.save();

        socket.broadcast.to(chatID).emit("message", msg.msg);
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("status", "offline");
        console.log("Client disconnected");
      });
    });
  });

  return io;
};
