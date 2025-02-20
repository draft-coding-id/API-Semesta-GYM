const express = require('express');
const { body } = require('express-validator');
const pricelistController = require('../controllers/pricelistController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get pricelist by name
router.get('/:name', auth, pricelistController.getPricelistByName);

// Create new pricelist
router.post('/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number')
  ],
  pricelistController.createPricelist
);

// Update pricelist
router.put('/:name',
  auth,
  [
    body('price').optional().isNumeric().withMessage('Price must be a number')
  ],
  pricelistController.updatePricelist
);

module.exports = router;