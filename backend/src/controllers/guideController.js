const Guide = require('../models/Guide');

/**
 * Get all guides
 * GET /api/guides
 */
const getGuides = async (req, res) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: guides.length,
      data: guides
    });
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guides.'
    });
  }
};

/**
 * Get single guide by ID
 * GET /api/guides/:id
 */
const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: guide
    });
  } catch (error) {
    console.error('Get guide by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guide.'
    });
  }
};

/**
 * Create new guide (Admin only)
 * POST /api/guides
 */
const createGuide = async (req, res) => {
  try {
    const { fullName, languages, fees, phone, whatsapp, areasCovered, city } = req.body;

    // Validation
    if (!fullName || !languages || !fees || !phone || !areasCovered || !city) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name, languages, fees, phone, areasCovered, and city are required.'
      });
    }

    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Languages must be a non-empty array.'
      });
    }

    if (!Array.isArray(areasCovered) || areasCovered.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Areas covered must be a non-empty array.'
      });
    }

    const guide = new Guide({
      fullName,
      languages,
      fees,
      phone,
      whatsapp: whatsapp || '',
      areasCovered,
      city
    });

    await guide.save();

    res.status(201).json({
      status: 'success',
      message: 'Guide created successfully',
      data: guide
    });
  } catch (error) {
    console.error('Create guide error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create guide.'
    });
  }
};

/**
 * Update guide (Admin only)
 * PUT /api/guides/:id
 */
const updateGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found.'
      });
    }

    // Update fields
    const { fullName, languages, fees, phone, whatsapp, areasCovered, city } = req.body;
    if (fullName) guide.fullName = fullName;
    if (languages) guide.languages = languages;
    if (fees) guide.fees = fees;
    if (phone) guide.phone = phone;
    if (whatsapp !== undefined) guide.whatsapp = whatsapp;
    if (areasCovered) guide.areasCovered = areasCovered;
    if (city) guide.city = city;

    await guide.save();

    res.status(200).json({
      status: 'success',
      message: 'Guide updated successfully',
      data: guide
    });
  } catch (error) {
    console.error('Update guide error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update guide.'
    });
  }
};

/**
 * Delete guide (Admin only)
 * DELETE /api/guides/:id
 */
const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Guide deleted successfully'
    });
  } catch (error) {
    console.error('Delete guide error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete guide.'
    });
  }
};

module.exports = {
  getGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide
};

