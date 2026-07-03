const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const requestValidator = require('../middleware/requestValidator');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  saveLocationSchema
} = require('../models/validationSchemas');

// Public endpoints
router.post('/register', requestValidator(registerSchema, 'body'), authController.register);
router.post('/login', requestValidator(loginSchema, 'body'), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

// Protected endpoints
router.get('/me', protect, authController.me);
router.put('/profile', protect, requestValidator(updateProfileSchema, 'body'), authController.updateProfile);
router.delete('/profile', protect, authController.deleteAccount);
router.get('/export', protect, authController.exportData);
router.post('/locations', protect, requestValidator(saveLocationSchema, 'body'), authController.saveLocation);
router.delete('/locations/:name', protect, authController.unsaveLocation);

module.exports = router;
