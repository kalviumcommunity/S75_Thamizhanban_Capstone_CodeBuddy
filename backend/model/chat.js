const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  AnswerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answers',
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
