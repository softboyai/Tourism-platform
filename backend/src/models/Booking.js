const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // What is being booked
  type: {
    type: String,
    required: true,
    enum: ['hotel', 'event', 'guide']
  },
  // Reference to the booked item (Hotel, Event, or Guide _id)
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['Hotel', 'Event', 'Guide']
  },
  // Snapshot of the item name at booking time
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  // Booking details
  checkInDate: {
    type: Date,
    required: [true, 'Check-in / start date is required']
  },
  checkOutDate: {
    type: Date // Only relevant for hotels
  },
  numberOfGuests: {
    type: Number,
    default: 1,
    min: [1, 'At least 1 guest required']
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [1000, 'Special requests cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  // Admin reply / note on the booking
  adminNote: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin note cannot exceed 1000 characters'],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
