const Hotel = require('../models/Hotel');

/**
 * Get all hotels
 * GET /api/hotels
 */
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch hotels.'
    });
  }
};

/**
 * Get single hotel by ID
 * GET /api/hotels/:id
 */
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch hotel.'
    });
  }
};

/**
 * Create new hotel (Admin only)
 * POST /api/hotels
 */
const createHotel = async (req, res) => {
  try {
    const { name, priceRange, phone, whatsapp, address, city, location } = req.body;

    // Parse location if it's a string (from FormData)
    let locationObj;
    if (typeof location === 'string') {
      try {
        locationObj = JSON.parse(location);
      } catch (e) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid location format. Must be valid JSON.'
        });
      }
    } else {
      locationObj = location;
    }

    // Validation
    if (!name || !priceRange || !phone || !address || !city || !locationObj || !locationObj.lat || !locationObj.lng) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, priceRange, phone, address, city, and location (lat, lng) are required.'
      });
    }

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      images.push(...req.files.map(file => `/uploads/${file.filename}`));
    } else if (req.body.images) {
      images.push(...(Array.isArray(req.body.images) ? req.body.images : []));
    }

    const hotel = new Hotel({
      name,
      priceRange,
      phone,
      whatsapp: whatsapp || '',
      address,
      city,
      location: locationObj,
      images
    });

    await hotel.save();

    res.status(201).json({
      status: 'success',
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create hotel.'
    });
  }
};

/**
 * Update hotel (Admin only)
 * PUT /api/hotels/:id
 */
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found.'
      });
    }

    // Update fields
    const { name, priceRange, phone, whatsapp, address, city, location } = req.body;
    if (name) hotel.name = name;
    if (priceRange) hotel.priceRange = priceRange;
    if (phone) hotel.phone = phone;
    if (whatsapp !== undefined) hotel.whatsapp = whatsapp;
    if (address) hotel.address = address;
    if (city) hotel.city = city;
    if (location) {
      const loc = typeof location === 'string' ? JSON.parse(location) : location;
      if (loc.lat !== undefined) hotel.location.lat = loc.lat;
      if (loc.lng !== undefined) hotel.location.lng = loc.lng;
    }
    
    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      hotel.images = [...(hotel.images || []), ...newImages];
    } else if (req.body.images !== undefined) {
      hotel.images = Array.isArray(req.body.images) ? req.body.images : [];
    }

    await hotel.save();

    res.status(200).json({
      status: 'success',
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update hotel.'
    });
  }
};

/**
 * Delete hotel (Admin only)
 * DELETE /api/hotels/:id
 */
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete hotel.'
    });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
};

