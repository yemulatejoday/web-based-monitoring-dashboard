const Bot = require('../models/Bot');
const Telemetry = require('../models/Telemetry');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/bots
 * Get all bots belonging to the current user
 */
const getBots = async (req, res, next) => {
  try {
    const bots = await Bot.find({ owner: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, { bots });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/bots
 * Register a bot to the current user's account
 */
const addBot = async (req, res, next) => {
  try {
    const { botId, name } = req.body;

    if (!botId) {
      return sendError(res, 400, 'Bot ID is required.');
    }

    // Check if this bot is already registered to this user
    const existing = await Bot.findOne({ botId, owner: req.user._id });
    if (existing) {
      return sendError(res, 400, 'This bot is already connected to your account.');
    }

    const bot = await Bot.create({
      botId,
      name: name || botId,
      owner: req.user._id,
    });

    sendSuccess(res, 201, { bot }, 'Bot connected successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/bots/:botId
 * Remove a bot from the user's account
 */
const removeBot = async (req, res, next) => {
  try {
    const bot = await Bot.findOneAndDelete({
      botId: req.params.botId,
      owner: req.user._id,
    });

    if (!bot) {
      return sendError(res, 404, 'Bot not found or not owned by you.');
    }

    sendSuccess(res, 200, {}, 'Bot removed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bots/available
 * Get bots that have sent telemetry but are not yet claimed by any user
 */
const getAvailableBots = async (req, res, next) => {
  try {
    // Find all botIds that have telemetry
    const telemetryBotIds = await Telemetry.distinct('botId');

    // Find all botIds already claimed
    const claimedBotIds = (await Bot.find({}).select('botId')).map((b) => b.botId);

    // Available = has telemetry but not claimed
    const availableIds = telemetryBotIds.filter((id) => !claimedBotIds.includes(id));

    const bots = availableIds.map((id) => ({
      id,
      name: 'Ready to Pair',
      signal: 'Strong',
      status: 'Ready',
    }));

    sendSuccess(res, 200, { bots });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBots, addBot, removeBot, getAvailableBots };
