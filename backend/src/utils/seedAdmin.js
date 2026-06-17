const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * Script to create initial admin user
 * Run this once: node -e "require('./src/utils/seedAdmin')()"
 * Or use the seed route with ADMIN_SECRET
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tourism-gabon.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', adminEmail);
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin
    const admin = new Admin({
      email: adminEmail,
      passwordHash
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// If run directly, execute the seed function
if (require.main === module) {
  require('dotenv').config();
  require('../../src/config/database')().then(() => {
    seedAdmin().then(() => process.exit(0));
  });
}

module.exports = seedAdmin;

