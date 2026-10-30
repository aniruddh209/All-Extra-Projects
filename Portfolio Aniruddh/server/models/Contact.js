const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: 200,
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
    default: '',
  },
  role: {
    type: String,
    trim: true,
    maxlength: 100,
    default: '',
  },
  budget: {
    type: String,
    trim: true,
    maxlength: 50,
    default: '',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 5000,
  },
  ip: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Contact', contactSchema);
