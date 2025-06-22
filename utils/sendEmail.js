const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,      // e.g., smtp.gmail.com
  port: process.env.MAIL_PORT || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Blog Admin" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    throw new Error('Email sending failed: ' + error.message);
  }
}

module.exports = sendEmail;
