const mongoose = require('mongoose');
const logger = require('./logger');

let isConnected = false;

const connectDB = async (mongoUri) => {
  const uri = mongoUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/skysense-ai';
  logger.info(`Connecting to MongoDB at: ${uri.replace(/:([^@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast in dev
    });
    isConnected = true;
    logger.info('MongoDB Connected successfully.');
  } catch (error) {
    logger.warn(`MongoDB not available: ${error.message}`);
    logger.warn('Running WITHOUT database — auth and chat history endpoints will return 503.');
    // Don't call process.exit — let the app run for weather/chatbot which don't need DB
  }
};

// Middleware that returns 503 for routes that require DB
const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Please set MONGODB_URI in your .env file or install MongoDB locally to use authentication features.'
    });
  }
  next();
};

module.exports = { connectDB, requireDB };
