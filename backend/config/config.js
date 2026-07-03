const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  cacheTtl: parseInt(process.env.CACHE_TTL, 10) || 600, // 10 minutes default
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/skysense-ai',
  jwtSecret: process.env.JWT_SECRET || 'skysense-jwt-access-secret-key-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'skysense-jwt-refresh-secret-key-2026',
};
