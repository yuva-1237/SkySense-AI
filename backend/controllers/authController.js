const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const config = require('../config/config');
const logger = require('../config/logger');

// Helpers for token signing
const signAccessToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '15m' });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: '7d' });
};

// Helper for cookie options
const getCookieOptions = (maxAgeMs) => {
  return {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
    maxAge: maxAgeMs
  };
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const user = await User.create({ email, password, name });
    
    // Sign tokens
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15 mins
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

    user.password = undefined; // Strip password

    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Sign tokens
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Set cookies
    res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 1000));

    user.password = undefined;

    res.status(200).json({
      success: true,
      data: { user, accessToken, refreshToken }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

exports.me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user }
  });
};

exports.refresh = async (req, res) => {
  try {
    let token = req.cookies.refreshToken;
    if (!token && req.body.refreshToken) {
      token = req.body.refreshToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found.'
      });
    }

    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist.'
      });
    }

    // Sign new access token
    const newAccessToken = signAccessToken(user._id);
    res.cookie('accessToken', newAccessToken, getCookieOptions(15 * 60 * 1000));

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken }
    });
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token. Please log in again.'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, password, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password = password; // Pre-save hook hashes this
    if (preferences) {
      if (preferences.unit) user.preferences.unit = preferences.unit;
      if (preferences.defaultCity !== undefined) user.preferences.defaultCity = preferences.defaultCity;
      if (preferences.notifications !== undefined) user.preferences.notifications = preferences.notifications;
    }

    await user.save();
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user }
    });
  } catch (error) {
    logger.error(`Profile update error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete related data
    await User.findByIdAndDelete(userId);
    await Conversation.deleteMany({ userId });
    await Notification.deleteMany({ userId });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Account and all related personal data permanently deleted.'
    });
  } catch (error) {
    logger.error(`Account deletion error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};

exports.exportData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    const conversations = await Conversation.find({ userId });
    const notifications = await Notification.find({ userId });

    res.status(200).json({
      success: true,
      data: {
        profile: user,
        chatHistory: conversations,
        alertHistory: notifications,
        exportedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Export data error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to export data.' });
  }
};

exports.saveLocation = async (req, res) => {
  try {
    const { name, lat, lon, country } = req.body;
    const user = await User.findById(req.user._id);

    // Prevent duplicates
    const alreadySaved = user.savedLocations.some(
      (loc) => loc.name.toLowerCase() === name.toLowerCase() || (Math.abs(loc.lat - lat) < 0.05 && Math.abs(loc.lon - lon) < 0.05)
    );

    if (alreadySaved) {
      return res.status(409).json({
        success: false,
        message: 'Location already saved in your favorites list.'
      });
    }

    user.savedLocations.push({ name, lat, lon, country: country || '' });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location saved to favorites.',
      data: { savedLocations: user.savedLocations }
    });
  } catch (error) {
    logger.error(`Save location error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to save location.' });
  }
};

exports.unsaveLocation = async (req, res) => {
  try {
    const { name } = req.params;
    const user = await User.findById(req.user._id);

    user.savedLocations = user.savedLocations.filter(
      (loc) => loc.name.toLowerCase() !== decodeURIComponent(name).toLowerCase()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Location removed from favorites.',
      data: { savedLocations: user.savedLocations }
    });
  } catch (error) {
    logger.error(`Unsave location error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to remove location.' });
  }
};
