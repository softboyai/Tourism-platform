const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/uploadMiddleware');
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');

// Public routes
router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);

// Admin routes (protected) with image upload
router.post('/hotels', verifyToken, uploadMultiple('images', 10), handleUploadError, createHotel);
router.put('/hotels/:id', verifyToken, uploadMultiple('images', 10), handleUploadError, updateHotel);
router.delete('/hotels/:id', verifyToken, deleteHotel);

module.exports = router;

