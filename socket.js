module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.broadcast.emit("status", "online");

    // To the single client: socket.emit()
    // To everybody: io.emit()
    // To everyone except the client: socket.broadcast.emit()

    socket.on("chatMessage", (msg, chatID) => {
      socket.broadcast.to(chatID).emit("message", msg);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("status", "offline");
      console.log("Client disconnected");
    });
  });

  return io;
};
