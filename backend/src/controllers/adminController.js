const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');
const Site = require('../models/Site');
const Hotel = require('../models/Hotel');
const Event = require('../models/Event');
const Guide = require('../models/Guide');
const Inquiry = require('../models/Inquiry');

/**
 * Get Daily or Weekly Report
 * GET /api/admin/reports?type=daily|weekly
 */
const getReport = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || !['daily', 'weekly'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter "type" is required. Use "daily" or "weekly".'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate;

    if (type === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const dateFilter = { createdAt: { $gte: startDate } };

    // Aggregate counts from all collections
    const [newSites, newHotels, newEvents, newGuides, newInquiries] = await Promise.all([
      Site.countDocuments(dateFilter),
      Hotel.countDocuments(dateFilter),
      Event.countDocuments(dateFilter),
      Guide.countDocuments(dateFilter),
      Inquiry.countDocuments(dateFilter)
    ]);

    // Get totals for context
    const [totalSites, totalHotels, totalEvents, totalGuides, totalInquiries] = await Promise.all([
      Site.countDocuments(),
      Hotel.countDocuments(),
      Event.countDocuments(),
      Guide.countDocuments(),
      Inquiry.countDocuments()
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        reportType: type,
        period: {
          from: startDate.toISOString(),
          to: now.toISOString()
        },
        newRecords: {
          sites: newSites,
          hotels: newHotels,
          events: newEvents,
          guides: newGuides,
          inquiries: newInquiries,
          total: newSites + newHotels + newEvents + newGuides + newInquiries
        },
        totals: {
          sites: totalSites,
          hotels: totalHotels,
          events: totalEvents,
          guides: totalGuides,
          inquiries: totalInquiries,
          total: totalSites + totalHotels + totalEvents + totalGuides + totalInquiries
        }
      }
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate report.'
    });
  }
};

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

/**
 * Generate PDF Report
 * GET /api/admin/reports/pdf?type=daily|weekly
 */
const getReportPDF = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || !['daily', 'weekly'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter "type" is required. Use "daily" or "weekly".'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate;

    if (type === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const dateFilter = { createdAt: { $gte: startDate } };

    // Get counts
    const [newSites, newHotels, newEvents, newGuides, newInquiries] = await Promise.all([
      Site.countDocuments(dateFilter),
      Hotel.countDocuments(dateFilter),
      Event.countDocuments(dateFilter),
      Guide.countDocuments(dateFilter),
      Inquiry.countDocuments(dateFilter)
    ]);

    const [totalSites, totalHotels, totalEvents, totalGuides, totalInquiries] = await Promise.all([
      Site.countDocuments(),
      Hotel.countDocuments(),
      Event.countDocuments(),
      Guide.countDocuments(),
      Inquiry.countDocuments()
    ]);

    // Get recent inquiries for the report
    const recentInquiries = await Inquiry.find(dateFilter).sort({ createdAt: -1 }).limit(10);

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    const filename = `tourism-report-${type}-${now.toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Title
    doc.fontSize(22).font('Helvetica-Bold').text('Tourism Platform - Gabon', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('Ogooue-Maritime Province', { align: 'center' });
    doc.moveDown(0.5);

    // Report type header
    const periodLabel = type === 'daily' ? 'DAILY REPORT' : 'WEEKLY REPORT';
    doc.fontSize(16).font('Helvetica-Bold').text(periodLabel, { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(
      `Period: ${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`,
      { align: 'center' }
    );
    doc.text(`Generated: ${now.toLocaleString()}`, { align: 'center' });

    doc.moveDown(1.5);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Summary Section
    doc.fontSize(14).font('Helvetica-Bold').text('SUMMARY');
    doc.moveDown(0.5);

    const totalNew = newSites + newHotels + newEvents + newGuides + newInquiries;
    const totalAll = totalSites + totalHotels + totalEvents + totalGuides + totalInquiries;

    doc.fontSize(11).font('Helvetica');
    doc.text(`Total New Activity (${type === 'daily' ? 'Today' : 'This Week'}): ${totalNew}`);
    doc.text(`Total Records in System: ${totalAll}`);
    doc.moveDown(1);

    // Data Table
    doc.fontSize(14).font('Helvetica-Bold').text('DETAILED BREAKDOWN');
    doc.moveDown(0.5);

    // Table header
    const tableTop = doc.y;
    const col1 = 50, col2 = 250, col3 = 370, col4 = 470;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Category', col1, tableTop);
    doc.text('New (' + (type === 'daily' ? 'Today' : 'This Week') + ')', col2, tableTop);
    doc.text('Total', col3, tableTop);
    doc.text('Status', col4, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    const rows = [
      { label: 'Tourist Sites', newCount: newSites, total: totalSites },
      { label: 'Hotels', newCount: newHotels, total: totalHotels },
      { label: 'Events', newCount: newEvents, total: totalEvents },
      { label: 'Tour Guides', newCount: newGuides, total: totalGuides },
      { label: 'Contact Inquiries', newCount: newInquiries, total: totalInquiries },
    ];

    let rowY = tableTop + 25;
    doc.font('Helvetica').fontSize(10);

    rows.forEach(row => {
      doc.text(row.label, col1, rowY);
      doc.text(String(row.newCount), col2, rowY);
      doc.text(String(row.total), col3, rowY);
      doc.text(row.newCount > 0 ? 'Active' : 'No change', col4, rowY);
      rowY += 20;
    });

    // Total row
    doc.moveTo(50, rowY).lineTo(550, rowY).stroke();
    rowY += 10;
    doc.font('Helvetica-Bold');
    doc.text('TOTAL', col1, rowY);
    doc.text(String(totalNew), col2, rowY);
    doc.text(String(totalAll), col3, rowY);
    doc.text(totalNew > 0 ? 'Active' : 'Quiet', col4, rowY);

    doc.moveDown(3);

    // Recent Inquiries Section
    if (recentInquiries.length > 0) {
      doc.y = rowY + 40;
      doc.fontSize(14).font('Helvetica-Bold').text('RECENT INQUIRIES');
      doc.moveDown(0.5);
      doc.fontSize(9).font('Helvetica');

      recentInquiries.forEach((inq, i) => {
        const date = new Date(inq.createdAt).toLocaleDateString();
        doc.font('Helvetica-Bold').text(`${i + 1}. ${inq.name} (${inq.email}) - ${date}`);
        doc.font('Helvetica').text(`   "${inq.message.substring(0, 100)}${inq.message.length > 100 ? '...' : ''}"`);
        doc.moveDown(0.3);
      });
    }

    // Footer
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(8).font('Helvetica').text(
      'This report was automatically generated by the Tourism Platform Admin System.',
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    console.error('PDF Report generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate PDF report.'
    });
  }
};

module.exports = {
  seedAdmin,
  getReport,
  getReportPDF
};

