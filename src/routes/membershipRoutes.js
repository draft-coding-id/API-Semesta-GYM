const express = require('express');
const { body } = require('express-validator');
const membershipController = require('../controllers/membershipController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new membership
router.post('/', 
  auth, 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  membershipController.createMembership
);

// Get all memberships
router.get('/', auth, membershipController.getAllMemberships);

// Get a single membership by ID
router.get('/:id', auth, membershipController.getMembershipById);

// Update a membership by ID
router.put('/:id', 
  auth, 
  [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('price').optional().notEmpty().withMessage('Price is required'),
    body('description').optional().notEmpty().withMessage('Description is required')
  ],  
  membershipController.updateMembership
);

// Delete a membership by ID
router.delete('/:id', auth, membershipController.deleteMembership);

// Assign membership to user
router.post('/assign', 
  auth, 
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('membershipId').notEmpty().withMessage('Membership ID is required'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date')
  ],
  membershipController.assignMembership);

module.exports = router;