const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new course
router.post('/', 
  auth, 
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date')
  ],
  courseController.createCourse
);

// Update a course by User ID
router.put('/user/:userId', 
  auth, 
  [
    body('price').optional().notEmpty().withMessage('Price is required'),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date')
  ],  
  courseController.updateCourseByUserId
);

// Delete a course by ID
router.delete('/:id', auth, courseController.deleteCourse);

// Get a single course by User ID
router.get('/user/:userId', auth, courseController.getCourseByUserId);

module.exports = router;