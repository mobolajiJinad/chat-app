const mongoose = require("mongoose");

const Message = require("./Message");

const chatSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chats: [Message.schema],
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
