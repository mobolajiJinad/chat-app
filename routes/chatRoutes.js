const express = require("express");

const getChatList = require("../controllers/chatListControllers");
const chatController = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").get(getChatList);

router.route("/:param").get(chatController);

module.exports = router;
