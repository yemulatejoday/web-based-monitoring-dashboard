const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getProfile);

router.put(
  '/',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    body('village').optional().trim(),
    body('district').optional().trim(),
    body('state').optional().trim(),
    body('cropsGrown').optional(),
  ],
  validate,
  updateProfile
);

module.exports = router;
