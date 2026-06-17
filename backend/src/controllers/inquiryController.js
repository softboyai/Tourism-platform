const Inquiry = require('../models/Inquiry');
const { sendReplyEmail } = require('../utils/emailService');

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

/**
 * Reply to an inquiry (Admin only)
 * PUT /api/admin/inquiries/:id/reply
 */
const replyToInquiry = async (req, res) => {
  try {
    const { adminReply } = req.body;

    if (!adminReply || !adminReply.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Reply message is required.'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found.'
      });
    }

    inquiry.adminReply = adminReply.trim();
    inquiry.repliedAt = new Date();
    inquiry.status = 'replied';

    await inquiry.save();

    // Send reply email to the visitor
    const emailResult = await sendReplyEmail(
      inquiry.email,
      inquiry.name,
      inquiry.message,
      adminReply.trim()
    );

    res.status(200).json({
      status: 'success',
      message: emailResult.success 
        ? 'Reply sent successfully and email delivered to visitor' 
        : 'Reply saved. ' + emailResult.message,
      emailSent: emailResult.success,
      data: inquiry
    });
  } catch (error) {
    console.error('Reply to inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send reply.'
    });
  }
};

/**
 * Delete an inquiry (Admin only)
 * DELETE /api/admin/inquiries/:id
 */
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete inquiry.'
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  replyToInquiry,
  deleteInquiry
};

