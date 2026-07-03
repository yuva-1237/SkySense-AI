/**
 * Firebase Admin SDK initialization.
 *
 * Priority order for credentials:
 *   1. Individual env vars: FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *   2. GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON file)
 *   3. Dev-mode fallback: decode token without full verification (logs a warning)
 *
 * For production, download your service account JSON from:
 *   Firebase Console → Project Settings → Service Accounts → Generate New Private Key
 * Then set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 */

const admin = require('firebase-admin');
const logger = require('./logger');

let firebaseInitialized = false;
let devMode = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'skysense-0000';

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    // Option 1: Individual env vars (recommended for production)
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    firebaseInitialized = true;
    logger.info('Firebase Admin: Initialized with service account credentials.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Option 2: Application Default Credentials (service account JSON file path)
    admin.initializeApp();
    firebaseInitialized = true;
    logger.info('Firebase Admin: Initialized with Application Default Credentials.');
  } else {
    // Option 3: Dev-mode fallback — tokens are decoded but NOT cryptographically verified
    devMode = true;
    logger.warn('Firebase Admin: No service account credentials found.');
    logger.warn('  Running in DEV MODE — Firebase tokens decoded but not cryptographically verified.');
    logger.warn('  Set FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY for production.');
  }
} catch (err) {
  devMode = true;
  logger.warn(`Firebase Admin init error: ${err.message}. Falling back to dev mode.`);
}

/**
 * Verify a Firebase ID token.
 * Returns the decoded token payload { uid, email, name, picture } or throws.
 */
async function verifyIdToken(idToken) {
  if (firebaseInitialized) {
    // Full cryptographic verification
    return admin.auth().verifyIdToken(idToken);
  }

  // Dev-mode: decode without verification (base64 decode the payload)
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (!payload.sub) throw new Error('Token missing subject claim');
    // Basic expiry check
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired');
    }
    return {
      uid: payload.sub,
      email: payload.email || '',
      name: payload.name || '',
      picture: payload.picture || '',
      email_verified: payload.email_verified || false,
      _devMode: true
    };
  } catch (err) {
    throw new Error(`Token verification failed: ${err.message}`);
  }
}

module.exports = { admin, verifyIdToken, firebaseInitialized, devMode };
