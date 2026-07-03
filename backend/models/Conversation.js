const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  text: { type: String, required: true }
}, { _id: false });

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  parts: [partSchema],
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null
  },
  messages: [messageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
