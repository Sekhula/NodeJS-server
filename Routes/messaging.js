const { Router } = require("express");
const messagingController = require("../Controller/mesesagingController");
const router = Router();

//Send A Message
router.post('/send-to-specific-user', messagingController.sendToSpecificUser);

//Gets Messages between 2 specific users
router.get('/dms', messagingController.getOneFromOne)

//Post in to a Group Chat
router.post('/group-chat-post', messagingController.topic)

//Gets from a specific group chat
router.get('/group-chat-topics/:id', messagingController.getTopicsForSpecificSubject)

//pPost to specific discussion
router.post('/post-To-Specific-Discussion', messagingController.postToSpecificDiscussion)

//Gets posts from a specific group discussion
router.get('/get-posts/:id', messagingController.getPostsFromSpecificDiscussion)

//Reply a posts from a specific group discussion
router.post('/reply', messagingController.makeReply)

router.get('/get-replies/:id', messagingController.getReplies)

module.exports = router;
