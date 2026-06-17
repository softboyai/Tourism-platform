const express = require('express');
const router = express.Router();
const verifyUserToken = require('../middleware/userAuth');
const verifyToken = require('../middleware/auth'); // admin auth
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');

// User routes (require user login)
router.post('/bookings', verifyUserToken, createBooking);
router.get('/bookings/mine', verifyUserToken, getMyBookings);
router.put('/bookings/:id/cancel', verifyUserToken, cancelBooking);

// Admin routes (require admin JWT)
router.get('/admin/bookings', verifyToken, getAllBookings);
router.put('/admin/bookings/:id/status', verifyToken, updateBookingStatus);
router.delete('/admin/bookings/:id', verifyToken, deleteBooking);

module.exports = router;
