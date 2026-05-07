const express = require('express');
const { body } = require('express-validator');
const { postTelemetry, getLatestTelemetry, getReports } = require('../controllers/telemetryController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ESP32 posts telemetry — no auth required
router.post(
  '/',
  [body('botId').trim().notEmpty().withMessage('botId is required')],
  validate,
  postTelemetry
);

// Protected routes for frontend
router.get('/:botId', protect, getLatestTelemetry);

module.exports = router;
