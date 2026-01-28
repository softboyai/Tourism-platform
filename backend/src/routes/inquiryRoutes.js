const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  createInquiry,
  getInquiries
} = require('../controllers/inquiryController');

// Public route
router.post('/inquiries', createInquiry);

// Admin route (protected)
router.get('/admin/inquiries', verifyToken, getInquiries);

module.exports = router;

