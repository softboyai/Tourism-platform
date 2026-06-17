const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/uploadMiddleware');
const {
  getSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite
} = require('../controllers/siteController');

// Public routes
router.get('/sites', getSites);
router.get('/sites/:id', getSiteById);

// Admin routes (protected) with image upload
router.post('/sites', verifyToken, uploadMultiple('images', 10), handleUploadError, createSite);
router.put('/sites/:id', verifyToken, uploadMultiple('images', 10), handleUploadError, updateSite);
router.delete('/sites/:id', verifyToken, deleteSite);

module.exports = router;

