const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * Create initial admin (protected by ADMIN_SECRET)
 * POST /api/admin/seed
 */
const seedAdmin = async (req, res) => {
  try {
    const { secret, email, password } = req.body;

    // Verify secret key
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized. Invalid secret key.'
      });
    }

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: 'Admin with this email already exists.'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin
    const admin = new Admin({
      email: email.toLowerCase().trim(),
      passwordHash
    });

    await admin.save();

    res.status(201).json({
      status: 'success',
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create admin. Please try again.'
    });
  }
};

module.exports = {
  seedAdmin
};

