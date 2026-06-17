const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide
} = require('../controllers/guideController');

// Public routes
router.get('/guides', getGuides);
router.get('/guides/:id', getGuideById);

// Admin routes (protected)
router.post('/guides', verifyToken, createGuide);
router.put('/guides/:id', verifyToken, updateGuide);
router.delete('/guides/:id', verifyToken, deleteGuide);

module.exports = router;

