const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/database');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tourism Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const siteRoutes = require('./src/routes/siteRoutes');
const hotelRoutes = require('./src/routes/hotelRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const guideRoutes = require('./src/routes/guideRoutes');
const inquiryRoutes = require('./src/routes/inquiryRoutes');

// API Routes
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', siteRoutes);
app.use('/api', hotelRoutes);
app.use('/api', eventRoutes);
app.use('/api', guideRoutes);
app.use('/api', inquiryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Tourism Promotion Platform API - Ogooué-Maritime Province',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

