const express = require("express");

const User = require("../model/User");
const Chat = require("../model/Chat");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { userID } = req.user;

  const user = await User.findById(userID);
  const chats = await Chat.find({ participants: { $in: userID } });

  console.log(chats);

  const username = user.username;

  res.render("chat-list", {
    title: "Chat List",
    username,
    userID,
    msg: { error: req.flash("error"), success: req.flash("success") },
  });
});

router
  .route("/:id")
  .get((req, res) => {
    const { id } = req.params;

    if (id === "logout") {
      req.session.destroy((err) => {
        if (err) {
          return req.flash("error", "Something went wrong");
        }
        res.redirect("/auth/login");
      });
      return;
    }

    res.redirect("/chat");
  })
  .post(async (req, res) => {
    const { id } = req.params;
    const { userID } = req.user;
    const { otherParticipantID } = req.body;

    const user = await User.findById(userID);
    const otherParticipant = await User.findById(otherParticipantID);
    const chat = await Chat.findById(id);

    if (!chat) {
      const newChat = await Chat.create({
        _id: id,
        participants: [
          {
            _id: userID,
          },
          {
            _id: otherParticipantID,
          },
        ],
      });
    }

    if (chat) {
      console.log(chat);
    }

    const otherParticipantUsername = otherParticipant.username;

    res.render("chat", {
      title: "Chat",
      otherParticipantUsername,
      msg: { error: req.flash("error"), success: req.flash("success") },
    });
  });

module.exports = router;
