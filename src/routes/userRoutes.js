const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', auth, userController.getAllUsers);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

router.put('/:id/update', auth, [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number')
], userController.update);

module.exports = router;
