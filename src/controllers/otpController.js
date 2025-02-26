const Otp = require('../models/Otp');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sendOtp } = require('../utils/sendOtp');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.createOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await Otp.create({
      email: user.email,
      otp: otp.toString(),
      expiresAt: expiresAt
    });

    await sendOtp(email, otp, expiresAt);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({
      where: { email, otp, expiresAt: { [Op.gt]: new Date() } }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await Otp.destroy({ where: { email } });

    const user = await User.findOne({ where: { email } });
    const token = generateToken(user.id);

    res.json({ 
      message: 'OTP verified successfully',
      token: token,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
}