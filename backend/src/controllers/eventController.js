const Event = require('../models/Event');

/**
 * Get all events
 * GET /api/events
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date ascending (upcoming first)

    res.status(200).json({
      status: 'success',
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events.'
    });
  }
};

/**
 * Get single event by ID
 * GET /api/events/:id
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch event.'
    });
  }
};

/**
 * Create new event (Admin only)
 * POST /api/events
 */
const createEvent = async (req, res) => {
  try {
    const { title, date, venue, description, city } = req.body;

    // Validation
    if (!title || !date || !venue || !description || !city) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, date, venue, description, and city are required.'
      });
    }

    // Handle uploaded poster image
    let posterImage = '';
    if (req.file) {
      posterImage = `/uploads/${req.file.filename}`;
    } else if (req.body.posterImage) {
      posterImage = req.body.posterImage;
    }

    const event = new Event({
      title,
      date,
      venue,
      description,
      city,
      posterImage
    });

    await event.save();

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create event.'
    });
  }
};

/**
 * Update event (Admin only)
 * PUT /api/events/:id
 */
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found.'
      });
    }

    // Update fields
    const { title, date, venue, description, city } = req.body;
    if (title) event.title = title;
    if (date) event.date = date;
    if (venue) event.venue = venue;
    if (description) event.description = description;
    if (city) event.city = city;
    
    // Handle uploaded poster image
    if (req.file) {
      event.posterImage = `/uploads/${req.file.filename}`;
    } else if (req.body.posterImage !== undefined) {
      event.posterImage = req.body.posterImage;
    }

    await event.save();

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update event.'
    });
  }
};

/**
 * Delete event (Admin only)
 * DELETE /api/events/:id
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete event.'
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

