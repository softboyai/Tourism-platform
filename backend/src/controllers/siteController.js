const Site = require('../models/Site');

/**
 * Get all sites with optional search, category, and city filters
 * GET /api/sites?search=term&category=beach&city=Port-Gentil
 */
const getSites = async (req, res) => {
  try {
    const { search, category, city } = req.query;
    
    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter.city = { $regex: city, $options: 'i' }; // Case-insensitive search
    }

    if (search) {
      // Search in name and description
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sites = await Site.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: sites.length,
      data: sites
    });
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sites.'
    });
  }
};

/**
 * Get single site by ID
 * GET /api/sites/:id
 */
const getSiteById = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        status: 'error',
        message: 'Site not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: site
    });
  } catch (error) {
    console.error('Get site by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch site.'
    });
  }
};

/**
 * Create new site (Admin only)
 * POST /api/sites
 */
const createSite = async (req, res) => {
  try {
    const { name, category, description, city, location } = req.body;

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
    if (!name || !category || !description || !city || !locationObj || !locationObj.lat || !locationObj.lng) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, category, description, city, and location (lat, lng) are required.'
      });
    }

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      images.push(...req.files.map(file => `/uploads/${file.filename}`));
    } else if (req.body.images) {
      // Fallback: if images are sent as JSON array (for existing paths)
      images.push(...(Array.isArray(req.body.images) ? req.body.images : []));
    }

    const site = new Site({
      name,
      category,
      description,
      city,
      location: locationObj,
      images
    });

    await site.save();

    res.status(201).json({
      status: 'success',
      message: 'Site created successfully',
      data: site
    });
  } catch (error) {
    console.error('Create site error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create site.'
    });
  }
};

/**
 * Update site (Admin only)
 * PUT /api/sites/:id
 */
const updateSite = async (req, res) => {
  try {
    const { name, category, description, city, location, images } = req.body;

    const site = await Site.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        status: 'error',
        message: 'Site not found.'
      });
    }

    // Update fields
    if (name) site.name = name;
    if (category) site.category = category;
    if (description) site.description = description;
    if (city) site.city = city;
    if (location) {
      const loc = typeof location === 'string' ? JSON.parse(location) : location;
      if (loc.lat !== undefined) site.location.lat = loc.lat;
      if (loc.lng !== undefined) site.location.lng = loc.lng;
    }
    
    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      site.images = [...(site.images || []), ...newImages];
    } else if (req.body.images !== undefined) {
      // If images array is provided, replace existing
      site.images = Array.isArray(req.body.images) ? req.body.images : [];
    }

    await site.save();

    res.status(200).json({
      status: 'success',
      message: 'Site updated successfully',
      data: site
    });
  } catch (error) {
    console.error('Update site error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update site.'
    });
  }
};

/**
 * Delete site (Admin only)
 * DELETE /api/sites/:id
 */
const deleteSite = async (req, res) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);

    if (!site) {
      return res.status(404).json({
        status: 'error',
        message: 'Site not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Site deleted successfully'
    });
  } catch (error) {
    console.error('Delete site error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete site.'
    });
  }
};

module.exports = {
  getSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite
};

