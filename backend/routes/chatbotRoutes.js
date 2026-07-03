const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const requestValidator = require('../middleware/requestValidator');
const { chatbotBodySchema } = require('../models/validationSchemas');
const { optionalAuth } = require('../middleware/authMiddleware');

// Optional auth: attaches req.user if Firebase token present, allows guests
router.post('/', optionalAuth, requestValidator(chatbotBodySchema, 'body'), chatbotController.sendMessage);
router.get('/history/:sessionId', chatbotController.getHistory);

module.exports = router;
