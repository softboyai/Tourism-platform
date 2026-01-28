const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { seedAdmin } = require('../controllers/adminController');

// Seed admin (protected by ADMIN_SECRET in body, not JWT)
router.post('/admin/seed', seedAdmin);

// Test protected route
router.get('/admin/verify', verifyToken, (req, res) => {
  res.json({
    status: 'success',
    message: 'Token is valid',
    admin: req.admin
  });
});

module.exports = router;

