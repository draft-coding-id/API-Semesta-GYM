const express = require('express');
const { body } = require('express-validator');
const otpController = require('../controllers/otpController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new OTP
router.post('/',
  [
    body('email').notEmpty().withMessage('Email is required')
  ],
  otpController.createOTP
);

// Verify OTP
router.post('/verify',
  [
    body('email').notEmpty().withMessage('Email is required'),
    body('otp').notEmpty().withMessage('OTP is required')
  ],
  otpController.verifyOTP
);

module.exports = router;