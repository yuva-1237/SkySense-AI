const crypto = require('crypto');
const chatbotService = require('../services/chatbotService');
const logger = require('../config/logger');

const sendMessage = async (req, res, next) => {
  try {
    let { sessionId, message, location } = req.body;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const userId = req.user ? req.user._id : null;

    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send the sessionId in a start event
    res.write(`data: ${JSON.stringify({ type: 'start', sessionId })}\n\n`);

    const replyData = await chatbotService.sendMessage(
      sessionId,
      message,
      userId,
      location,
      (chunkText) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
      }
    );

    // Send final event with weatherSnapshot & location metadata
    res.write(`data: ${JSON.stringify({
      type: 'done',
      location: replyData.location,
      weatherSnapshot: replyData.weatherSnapshot
    })}\n\n`);
    res.end();
  } catch (error) {
    logger.error(`Error in sendMessage controller: ${error.message}`);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    } else {
      next(error);
    }
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const messages = chatbotService.getSessionMessages(sessionId);
    res.json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    logger.error(`Error in getHistory controller: ${error.message}`);
    next(error);
  }
};

module.exports = { sendMessage, getHistory };
