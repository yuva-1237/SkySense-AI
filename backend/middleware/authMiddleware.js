const { verifyIdToken } = require('../config/firebaseAdmin');
const logger = require('../config/logger');

/**
 * protect — verifies Firebase ID token and attaches req.user = { uid, email, name }
 * Reads token from Authorization: Bearer <token> header
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const decoded = await verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || '',
      name: decoded.name || decoded.email?.split('@')[0] || 'User',
      picture: decoded.picture || ''
    };
    next();
  } catch (error) {
    logger.warn(`Auth token error: ${error.message}`);
    if (error.message?.includes('expired') || error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please sign in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please sign in again.'
    });
  }
};

/**
 * optionalAuth — attaches req.user if a valid token is present, but never blocks the request
 */
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = await verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email || '',
        name: decoded.name || '',
        picture: decoded.picture || ''
      };
    } catch (_) {
      // Invalid token — continue as guest
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
