const express = require('express');
const { body } = require('express-validator');
const trainerController = require('../controllers/trainerController');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all trainers
router.get('/', trainerController.getAllTrainers);

// Get trainer by ID
router.get('/:id', trainerController.getTrainerById);

// Register new trainer
router.post('/register', 
  upload.single('picture'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('trainingFocus').notEmpty().isArray().withMessage('Training focus ID is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('hoursOfPractice').notEmpty().withMessage('Hours of practice is required'),
    body('price').isNumeric().withMessage('Price must be a number')
  ],
  trainerController.registerTrainer
);

module.exports = router;