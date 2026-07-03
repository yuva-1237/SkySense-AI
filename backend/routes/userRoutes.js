const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes require a valid Firebase ID token
router.get('/me', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.delete('/account', protect, userController.deleteAccount);
router.get('/export', protect, userController.exportData);
router.post('/locations', protect, userController.saveLocation);
router.delete('/locations/:name', protect, userController.unsaveLocation);

module.exports = router;
