const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/uploadMiddleware');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public routes
router.get('/events', getEvents);
router.get('/events/:id', getEventById);

// Admin routes (protected) with image upload
router.post('/events', verifyToken, uploadSingle('posterImage'), handleUploadError, createEvent);
router.put('/events/:id', verifyToken, uploadSingle('posterImage'), handleUploadError, updateEvent);
router.delete('/events/:id', verifyToken, deleteEvent);

module.exports = router;

