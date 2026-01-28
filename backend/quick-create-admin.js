// Quick Admin Creation Script
// Run: node quick-create-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const bcrypt = require('bcryptjs');

// Default credentials
const ADMIN_EMAIL = 'admin@tourism-gabon.com';
const ADMIN_PASSWORD = 'Admin123456';

async function createAdmin() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
        
        if (existingAdmin) {
            console.log('');
            console.log('⚠️  Admin already exists!');
            console.log('');
            console.log('Use these credentials to login:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📧 Email:    ${ADMIN_EMAIL}`);
            console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            await mongoose.connection.close();
            return;
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

        // Create admin
        const admin = new Admin({
            email: ADMIN_EMAIL,
            passwordHash
        });

        await admin.save();

        console.log('');
        console.log('✅ Admin created successfully!');
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔐 LOGIN CREDENTIALS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email:    ${ADMIN_EMAIL}`);
        console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('📝 Next steps:');
        console.log('   1. Make sure server is running (npm run dev)');
        console.log('   2. Open frontend/admin-login.html in browser');
        console.log('   3. Login with the credentials above');
        console.log('');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('');
        console.error('Make sure:');
        console.error('  1. MongoDB is running and connected');
        console.error('  2. .env file exists with MONGODB_URI');
        process.exit(1);
    }
}

createAdmin();

