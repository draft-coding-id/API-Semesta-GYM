const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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

router.post('/data-course', 
  auth,
  upload.single('picture'),
  [
    body('trainingFocusId').notEmpty().withMessage('Training focus ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('numberOfPractices').notEmpty().withMessage('Number of practices is required')
  ],
  courseController.createDataCourse
);

router.put('/data-course/:id',
  auth,
  upload.single('picture'),
  [
    body('trainingFocusId').optional().notEmpty().withMessage('Training focus ID is required'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('numberOfPractices').optional().notEmpty().withMessage('Number of practices is required')
  ],
  courseController.updateDataCourse
);

router.delete('/data-course/:id', auth, courseController.deleteDataCourse);

router.get('/data-course', auth, courseController.getAllDataCourses);

router.get('/data-course/:id', auth, courseController.getDataCourseById);

router.get('/data-course/training-focus/:id', auth, courseController.getDataCourseByTrainingFocusId);

module.exports = router;