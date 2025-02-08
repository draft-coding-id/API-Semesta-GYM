const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new payment booking
router.post('/booking', 
  auth, 
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('amount').notEmpty().withMessage('Amount is required'),
    body('paidAt').isISO8601().withMessage('Payment date must be a valid date'),
    body('userId').notEmpty().withMessage('User ID is required')
  ],
  paymentController.createPaymentBooking
);

// Create a new payment user membership
router.post('/membership', 
  auth, 
  [
    body('userMembershipId').notEmpty().withMessage('User Membership ID is required'),
    body('amount').notEmpty().withMessage('Amount is required'),
    body('paidAt').isISO8601().withMessage('Payment date must be a valid date'),
    body('userId').notEmpty().withMessage('User ID is required')
  ],
  paymentController.createPaymentUserMembership
);

router.post('/course',
  auth,
  [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('amount').notEmpty().withMessage('Amount is required'),
    body('paidAt').isISO8601().withMessage('Payment date must be a valid date'),
    body('userId').notEmpty().withMessage('User ID is required')
  ],
  paymentController.createPaymentCourse
);

// Get Payment by User ID
router.get('/user/:id', auth, paymentController.getPaymentByUserId);

// Get All Payments
router.get('/', auth, paymentController.getAllPayments);

module.exports = router;