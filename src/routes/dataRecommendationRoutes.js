const express = require('express');
const { body } = require('express-validator');
const dataRecommendationController = require('../controllers/dataRecommendationController');
const auth = require('../middleware/auth');

const router = express.Router();

// Post data recommendation
router.post('/', 
  auth, 
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('data').notEmpty().withMessage('Data is required')
  ],
  dataRecommendationController.createDataRecommendation
);

// Get data recommendation by User ID
router.get('/:userId', auth, dataRecommendationController.getDataRecommendationByUserId);

module.exports = router;