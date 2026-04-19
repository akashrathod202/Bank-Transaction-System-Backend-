require('dotenv').config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
const nodemailer = require('nodemailer');

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// ✅ Verify connection (runs once on startup)
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// ✅ Generic send function
const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("📨 Sending email to:", to); // DEBUG LOG

    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Message sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

// ✅ Registration email
const sendRegistrationEmail = async (userEmail, name) => {
  console.log("🚀 Inside sendRegistrationEmail");

  if (!userEmail) {
    console.log("❌ No email provided");
    return;
  }

  const subject = 'Welcome to Backend Ledger!';

  const text = `Hello ${name},
Thank you for registering at Backend Ledger.
We're excited to have you on board!

Best regards,
The Backend Ledger Team`;

  const html = `
    <h2>Hello ${name},</h2>
    <p>Thank you for registering at <b>Backend Ledger</b> 🎉</p>
    <p>We're excited to have you on board!</p>
    <p>Best regards,<br/>The Backend Ledger Team</p>
  `;

  await sendEmail(userEmail, subject, text, html);
};

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// ✅ Export correctly
module.exports = {
  sendRegistrationEmail,
};