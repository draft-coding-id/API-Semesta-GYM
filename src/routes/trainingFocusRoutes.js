const express = require('express');
const { body } = require('express-validator');
const trainingFocusController = require('../controllers/trainingFocusController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all training focus
router.get('/', trainingFocusController.getAllTrainingFocus);

// Get training focus by ID
router.get('/:id', auth ,trainingFocusController.getTrainingFocusById);

// Create new training focus (admin only)
router.post('/',
  auth,
  upload.single('picture'),
  [
    body('name').notEmpty().withMessage('Name is required')
  ],
  trainingFocusController.createTrainingFocus
);

// Update training focus (admin only)
router.put('/:id',
  auth,
  upload.single('picture'),
  [
    body('name').notEmpty().withMessage('Name is required')
  ],
  trainingFocusController.updateTrainingFocus
);

// Delete training focus (admin only)
router.delete('/:id',
  auth,
  trainingFocusController.deleteTrainingFocus
);

module.exports = router;