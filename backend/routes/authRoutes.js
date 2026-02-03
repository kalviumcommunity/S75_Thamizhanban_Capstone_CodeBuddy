const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');

router.post('/signup', authController.signup);
router.get('/signup', authController.getSignupData); // Kept this as it was in original code
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authMiddleware, authController.verifyUser);

module.exports = router;
