const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all bookings
router.get('/', auth, bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', auth, bookingController.getBookingById);

// Get booking by User ID
router.get('/member/:id', auth, bookingController.getBookingByIdMember);

// Get booking by Trainer ID
router.get('/trainer/:id', auth, bookingController.getBookingByIdTrainer);

// Create new booking
router.post('/',
  auth,
  [
    body('memberId').notEmpty().withMessage('Member ID is required'),
    body('trainerId').notEmpty().withMessage('Trainer ID is required'),
    body('week1Date').isISO8601().withMessage('Week 1 date must be a valid date'),
    body('week2Date').isISO8601().withMessage('Week 2 date must be a valid date'),
    body('week3Date').isISO8601().withMessage('Week 3 date must be a valid date'),
    body('week4Date').isISO8601().withMessage('Week 4 date must be a valid date')
  ],
  bookingController.createBooking
);

// Update booking
router.put('/:id',
  auth,
  [
    body('week1Date').optional().isISO8601().withMessage('Week 1 date must be a valid date'),
    body('week1Done').optional().isBoolean().withMessage('Week 1 done must be a boolean'),
    body('week2Date').optional().isISO8601().withMessage('Week 2 date must be a valid date'),
    body('week2Done').optional().isBoolean().withMessage('Week 2 done must be a boolean'),
    body('week3Date').optional().isISO8601().withMessage('Week 3 date must be a valid date'),
    body('week3Done').optional().isBoolean().withMessage('Week 3 done must be a boolean'),
    body('week4Date').optional().isISO8601().withMessage('Week 4 date must be a valid date'),
    body('week4Done').optional().isBoolean().withMessage('Week 4 done must be a boolean'),
    body('acceptedTrainer').optional().isBoolean().withMessage('Accepted trainer must be a boolean'),
    body('done').optional().isBoolean().withMessage('Done must be a boolean'),
    body('reasonRejection').optional().notEmpty().withMessage('Reason Rejection is required')
  ],
  bookingController.updateBooking
);

// Delete booking
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;