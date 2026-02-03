const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');

router.get('/allQuestions', questionController.getAllQuestions);
// Note: /postedQuestions and /myQuestions seem to do the same thing in original code, keeping both for compatibility
router.get('/postedQuestions', authMiddleware, questionController.getPostedQuestions);
router.post('/postQuestion', authMiddleware, questionController.postQuestion);
router.get('/myQuestions', authMiddleware, questionController.getMyQuestions);

module.exports = router;
