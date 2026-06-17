const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Event = require('../models/Event');
const Guide = require('../models/Guide');

// Map type → model
const modelMap = { hotel: Hotel, event: Event, guide: Guide };
const modelNameMap = { hotel: 'Hotel', event: 'Event', guide: 'Guide' };

/**
 * Create a booking (user only)
 * POST /api/bookings
 */
const createBooking = async (req, res) => {
  try {
    const { type, itemId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    if (!type || !itemId || !checkInDate) {
      return res.status(400).json({ status: 'error', message: 'Type, item ID, and check-in date are required.' });
    }

    if (!modelMap[type]) {
      return res.status(400).json({ status: 'error', message: 'Invalid booking type. Must be hotel, event, or guide.' });
    }

    // Get item name for snapshot
    const Model = modelMap[type];
    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({ status: 'error', message: `${type} not found.` });
    }

    const itemName = item.name || item.title || item.fullName || 'Unknown';

    const booking = new Booking({
      user: req.user.id,
      type,
      itemId,
      itemModel: modelNameMap[type],
      itemName,
      checkInDate: new Date(checkInDate),
      checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
      numberOfGuests: numberOfGuests || 1,
      specialRequests: specialRequests || ''
    });

    await booking.save();

    res.status(201).json({
      status: 'success',
      message: 'Booking submitted successfully! Status is pending until confirmed by admin.',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    res.status(500).json({ status: 'error', message: 'Failed to create booking.' });
  }
};

/**
 * Get all bookings for the logged-in user
 * GET /api/bookings/mine
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch bookings.' });
  }
};

/**
 * Cancel a booking (user can only cancel their own pending bookings)
 * PUT /api/bookings/:id/cancel
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found.' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ status: 'error', message: 'Booking is already cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ status: 'success', message: 'Booking cancelled.', data: booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to cancel booking.' });
  }
};

// ========== ADMIN BOOKING MANAGEMENT ==========

/**
 * Get all bookings (admin)
 * GET /api/admin/bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch bookings.' });
  }
};

/**
 * Update booking status (admin) — confirm or cancel
 * PUT /api/admin/bookings/:id/status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Status must be pending, confirmed, or cancelled.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found.' });
    }

    booking.status = status;
    if (adminNote !== undefined) booking.adminNote = adminNote;
    await booking.save();

    // Populate user info for response
    await booking.populate('user', 'fullName email');

    res.status(200).json({ status: 'success', message: 'Booking updated.', data: booking });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update booking.' });
  }
};

/**
 * Delete a booking (admin)
 * DELETE /api/admin/bookings/:id
 */
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found.' });
    }
    res.status(200).json({ status: 'success', message: 'Booking deleted.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete booking.' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
};
