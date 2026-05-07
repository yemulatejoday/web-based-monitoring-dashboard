const express = require('express');
const { body } = require('express-validator');
const { submitHelp, getMyHelp } = require('../controllers/helpController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Submit help — optionally authenticated
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message too long'),
  ],
  validate,
  submitHelp
);

// Get my help requests
router.get('/', protect, getMyHelp);

module.exports = router;
