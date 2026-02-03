const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middleware/auth');

router.post('/postAnswer', authMiddleware, answerController.postAnswer);
router.get('/allAnswers/:id', answerController.getAllAnswers);
router.put('/rate/:answerId', authMiddleware, answerController.rateAnswer);
router.get('/myAnswers', authMiddleware, answerController.getMyAnswers);

module.exports = router;
