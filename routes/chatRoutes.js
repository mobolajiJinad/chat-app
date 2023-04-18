const express = require("express");

const getChatList = require("../controllers/chatListControllers");
const chatController = require("../controllers/chatControllers");
const deleteChatController = require("../controllers/delChatControllers");

const router = express.Router();

router.route("/").get(getChatList);

router.route("/:param").get(chatController);

router.route("/:param/delete").get(deleteChatController);

module.exports = router;
