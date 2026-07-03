const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null
  },
  event: {
    type: String,
    required: true
  },
  headline: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    default: 'Moderate'
  },
  areas: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
