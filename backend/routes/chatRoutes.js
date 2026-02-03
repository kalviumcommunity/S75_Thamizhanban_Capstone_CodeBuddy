const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
// Chat routes were public in original logic? Checking...
// Original: router.get('/chat/:answerId', ...)
// Original: router.post('/chat', ...)
// No authMiddleware used in original for these two.

router.get('/chat/:answerId', chatController.getChatMessages);
router.post('/chat', chatController.postChatMessage);

module.exports = router;
