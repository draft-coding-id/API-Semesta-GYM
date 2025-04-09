const express = require('express');
const { body } = require('express-validator');
const trainerController = require('../controllers/trainerController');
const upload = require('../middleware/upload');
const { route } = require('./authRoutes');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/top-trainers', trainerController.getTopTrainers);
// Get all trainers
router.get('/', auth, trainerController.getAllTrainers);

// Get trainer by ID
router.get('/:id', auth, trainerController.getTrainerById);

// Register new trainer
router.post('/register', 
  upload.single('picture'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
    body('trainingFocus').notEmpty().isArray().withMessage('Training focus ID is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('hoursOfPractice').notEmpty().withMessage('Hours of practice is required'),
    body('price').isNumeric().withMessage('Price must be a number')
  ],
  trainerController.registerTrainer
);

router.put('/:id',
  auth,
  upload.single('picture'),
  [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
    body('trainingFocus').optional().isArray().withMessage('Training focus ID is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('hoursOfPractice').optional().notEmpty().withMessage('Hours of practice is required'),
    body('price').optional().isNumeric().withMessage('Price must be a number')
  ],
  trainerController.updateTrainer
);

router.delete('/:id', auth, trainerController.deleteTrainer);

module.exports = router;