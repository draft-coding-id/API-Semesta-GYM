const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendOtp(email, otp, expiresAt) {
  const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true untuk port 465, false untuk port lainnya
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

  let mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Semesta GYM OTP',
    html: `
      <h2>Your OTP is</h2>
      <h1>${otp}</h1>
      <p>It will expire at ${expiresAt}</p>
      <p>Please use this OTP to verify your account</p>
    `
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ' + error);
  }
}

module.exports = { sendOtp };