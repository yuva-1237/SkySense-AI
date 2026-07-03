/**
 * User profile controller — backed by Firestore.
 * Firebase UID (req.user.uid) is the primary key everywhere.
 * No MongoDB, no bcrypt, no JWT — Firebase handles auth.
 */

const { admin, firebaseInitialized, devMode } = require('../config/firebaseAdmin');
const logger = require('../config/logger');

// Firestore reference helper (only usable when Firebase Admin is fully initialized)
const userDocRef = (uid) => admin.firestore ? admin.firestore().doc(`users/${uid}`) : null;

// Guard for routes that require Firestore
const requireFirestore = (res) => {
  if (devMode || !firebaseInitialized) {
    res.status(503).json({
      success: false,
      message: 'Firestore unavailable — Firebase Admin not fully configured. User profile is managed client-side via Firestore SDK. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in backend/.env to enable server-side profile management.'
    });
    return false;
  }
  return true;
};

// ─── GET /api/users/me ────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  // In dev mode (no service account), return the Firebase token claims directly
  if (devMode || !firebaseInitialized) {
    return res.json({
      success: true,
      data: {
        profile: {
          uid: req.user.uid,
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.picture || '',
          savedLocations: [],
          preferences: { unit: 'c', defaultCity: 'Manchester' },
          _note: 'Profile served from token claims — Firestore not configured on backend'
        }
      }
    });
  }
  try {
    const snap = await userDocRef(req.user.uid).get();
    const profile = snap.exists ? snap.data() : {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.picture || '',
      savedLocations: [],
      preferences: { unit: 'c', defaultCity: 'Manchester' }
    };
    res.json({ success: true, data: { profile } });
  } catch (err) {
    logger.error(`getProfile error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to load profile.' });
  }
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    const ref = userDocRef(req.user.uid);
    const snap = await ref.get();

    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (preferences) {
      const existing = snap.exists ? (snap.data().preferences || {}) : {};
      updates.preferences = { ...existing, ...preferences };
    }
    updates.updatedAt = new Date().toISOString();

    if (snap.exists) {
      await ref.update(updates);
    } else {
      await ref.set({
        uid: req.user.uid,
        email: req.user.email,
        savedLocations: [],
        preferences: { unit: 'c', defaultCity: 'Manchester' },
        createdAt: new Date().toISOString(),
        ...updates
      });
    }

    const updated = (await ref.get()).data();
    res.json({ success: true, message: 'Profile updated.', data: { profile: updated } });
  } catch (err) {
    logger.error(`updateProfile error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// ─── DELETE /api/users/account ────────────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
  try {
    const uid = req.user.uid;
    // Delete Firestore doc
    await userDocRef(uid).delete();
    // Delete Firebase Auth user
    await admin.auth().deleteUser(uid);
    res.json({ success: true, message: 'Account and all data permanently deleted.' });
  } catch (err) {
    logger.error(`deleteAccount error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};

// ─── GET /api/users/export ────────────────────────────────────────────────────
exports.exportData = async (req, res) => {
  try {
    const snap = await userDocRef(req.user.uid).get();
    res.json({
      success: true,
      data: {
        profile: snap.exists ? snap.data() : {},
        firebaseUid: req.user.uid,
        email: req.user.email,
        exportedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    logger.error(`exportData error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to export data.' });
  }
};

// ─── POST /api/users/locations ────────────────────────────────────────────────
exports.saveLocation = async (req, res) => {
  try {
    const { name, lat, lon, country } = req.body;
    const ref = userDocRef(req.user.uid);
    const snap = await ref.get();
    const existing = snap.exists ? (snap.data().savedLocations || []) : [];

    const duplicate = existing.some(
      l => l.name.toLowerCase() === name.toLowerCase() ||
        (Math.abs(l.lat - lat) < 0.05 && Math.abs(l.lon - lon) < 0.05)
    );
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'Location already saved.' });
    }

    const newLocation = { name, lat, lon, country: country || '' };
    const savedLocations = [...existing, newLocation];

    if (snap.exists) {
      await ref.update({ savedLocations });
    } else {
      await ref.set({ savedLocations, uid: req.user.uid, email: req.user.email });
    }

    res.json({ success: true, message: 'Location saved.', data: { savedLocations } });
  } catch (err) {
    logger.error(`saveLocation error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to save location.' });
  }
};

// ─── DELETE /api/users/locations/:name ───────────────────────────────────────
exports.unsaveLocation = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const ref = userDocRef(req.user.uid);
    const snap = await ref.get();
    const existing = snap.exists ? (snap.data().savedLocations || []) : [];
    const savedLocations = existing.filter(
      l => l.name.toLowerCase() !== name.toLowerCase()
    );
    await ref.update({ savedLocations });
    res.json({ success: true, message: 'Location removed.', data: { savedLocations } });
  } catch (err) {
    logger.error(`unsaveLocation error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to remove location.' });
  }
};
