const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [200, 'Full name cannot exceed 200 characters']
  },
  languages: [{
    type: String,
    trim: true,
    required: true
  }],
  fees: {
    type: String,
    required: [true, 'Fees information is required'],
    trim: true,
    maxlength: [200, 'Fees cannot exceed 200 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  whatsapp: {
    type: String,
    trim: true,
    maxlength: [20, 'WhatsApp number cannot exceed 20 characters']
  },
  areasCovered: [{
    type: String,
    trim: true,
    required: true
  }],
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;

