const express = require('express');
const { getReports } = require('../controllers/telemetryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/:botId', getReports);

module.exports = router;
