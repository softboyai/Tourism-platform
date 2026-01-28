const Inquiry = require('../models/Inquiry');

/**
 * Create new inquiry (Public)
 * POST /api/inquiries
 */
const createInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and message are required.'
      });
    }

    const inquiry = new Inquiry({
      name,
      email,
      message
    });

    await inquiry.save();

    res.status(201).json({
      status: 'success',
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit inquiry.'
    });
  }
};

/**
 * Get all inquiries (Admin only)
 * GET /api/admin/inquiries
 */
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch inquiries.'
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries
};

