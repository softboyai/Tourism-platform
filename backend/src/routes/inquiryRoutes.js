const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  createInquiry,
  getInquiries,
  replyToInquiry,
  deleteInquiry
} = require('../controllers/inquiryController');

// Public route
router.post('/inquiries', createInquiry);

// Admin routes (protected)
router.get('/admin/inquiries', verifyToken, getInquiries);
router.put('/admin/inquiries/:id/reply', verifyToken, replyToInquiry);
router.delete('/admin/inquiries/:id', verifyToken, deleteInquiry);

module.exports = router;

