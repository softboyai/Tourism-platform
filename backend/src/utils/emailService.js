const nodemailer = require('nodemailer');

/**
 * Email service for sending replies to visitors.
 * 
 * Configure your SMTP settings in the .env file:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password
 *   SMTP_FROM="Gabon Tourism <your-email@gmail.com>"
 */

function createTransporter() {
  // If SMTP is not configured, return null (replies will be saved but not emailed)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send a reply email to the visitor
 * @param {string} toEmail - Visitor's email address
 * @param {string} visitorName - Visitor's name
 * @param {string} originalMessage - The original message from the visitor
 * @param {string} adminReply - The admin's reply
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendReplyEmail(toEmail, visitorName, originalMessage, adminReply) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('⚠️  SMTP not configured. Reply saved but email not sent.');
    return { success: false, message: 'SMTP not configured. Reply saved but email not sent.' };
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  const mailOptions = {
    from: fromAddress,
    to: toEmail,
    subject: 'Reply to your inquiry - Gabon Tourism (Ogooué-Maritime)',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2c7a4b; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 1.5rem;">🇬🇦 Gabon Tourism</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Ogooué-Maritime Province</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border: 1px solid #eee;">
          <p>Hello <strong>${visitorName}</strong>,</p>
          <p>Thank you for contacting us. Here is our response to your inquiry:</p>
          
          <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2c7a4b;">
            <strong>Our reply:</strong>
            <p style="margin: 8px 0 0;">${adminReply}</p>
          </div>
          
          <div style="background: #fff; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ccc;">
            <strong>Your original message:</strong>
            <p style="margin: 8px 0 0; color: #666;">${originalMessage}</p>
          </div>
          
          <p>If you have further questions, feel free to send us another message on our website.</p>
          <p style="margin-top: 20px;">Best regards,<br><strong>Gabon Tourism Team</strong></p>
        </div>
        
        <div style="text-align: center; padding: 15px; color: #999; font-size: 0.85rem;">
          <p>Tourism Promotion Platform - Ogooué-Maritime Province, Gabon</p>
        </div>
      </div>
    `,
    text: `Hello ${visitorName},\n\nThank you for contacting us. Here is our response:\n\n${adminReply}\n\nYour original message:\n${originalMessage}\n\nBest regards,\nGabon Tourism Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reply email sent to ${toEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return { success: false, message: `Failed to send email: ${error.message}` };
  }
}

module.exports = { sendReplyEmail };
