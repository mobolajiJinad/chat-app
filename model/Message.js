const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageText: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Message", messageSchema);
