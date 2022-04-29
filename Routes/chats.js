const { Router } = require("express");
const chats = require("../Controller/chatController");
const router = Router();

router.post('/', chats.sendMessage);
router.get('/:id', chats.recieveMessage);

module.exports = router;