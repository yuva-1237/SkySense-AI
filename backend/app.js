const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const config = require('./config/config');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const weatherRoutes = require('./routes/weatherRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ─── Security Middlewares ──────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' }
});
app.use(globalLimiter);

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);        // Firebase-backed user profile
app.use('/api/weather', weatherRoutes);   // Weather data (no auth required)
app.use('/api/chatbot', chatbotRoutes);   // AI chatbot (optional auth)

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const { firebaseInitialized, devMode } = require('./config/firebaseAdmin');
  res.json({
    status: 'OK',
    timestamp: new Date(),
    firebase: firebaseInitialized ? 'production' : 'dev-mode'
  });
});

// ─── Serve static frontend in production ───────────────────────────────────────
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// ─── Centralized Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
