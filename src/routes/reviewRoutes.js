const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all reviews by trainer ID
router.get('/:trainerId', auth, reviewController.getReviews);

// Create new review
router.post('/',
  auth,
  [
    body('memberId').notEmpty().withMessage('Member ID is required'),
    body('trainerId').notEmpty().withMessage('Trainer ID is required'),
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('rating').isNumeric().withMessage('Rating must be a number'),
    body('comment').notEmpty().withMessage('Comment is required')
  ],
  reviewController.createReview
);

module.exports = router;