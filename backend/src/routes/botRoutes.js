const express = require('express');
const { body } = require('express-validator');
const { getBots, addBot, removeBot, getAvailableBots } = require('../controllers/botController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getBots);
router.get('/available', getAvailableBots);

router.post(
  '/',
  [body('botId').trim().notEmpty().withMessage('Bot ID is required')],
  validate,
  addBot
);

router.delete('/:botId', removeBot);

module.exports = router;
