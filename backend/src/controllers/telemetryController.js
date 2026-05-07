const Telemetry = require('../models/Telemetry');
const Bot = require('../models/Bot');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/telemetry
 * ESP32 posts live telemetry data (no auth required — device endpoint)
 */
const postTelemetry = async (req, res, next) => {
  try {
    const { botId, distance, area, pesticide, battery, tank, status } = req.body;

    if (!botId) {
      return sendError(res, 400, 'botId is required.');
    }

    const entry = await Telemetry.create({
      botId,
      distance: Number(distance) || 0,
      area: Number(area) || 0,
      pesticide: Number(pesticide) || 0,
      battery: Number(battery) || 100,
      tank: Number(tank) || 100,
      status: status || 'Active',
    });

    // Update bot's lastSeen if it exists
    await Bot.findOneAndUpdate({ botId }, { lastSeen: new Date(), isActive: true });

    sendSuccess(res, 201, { entry }, 'Telemetry recorded');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/telemetry/:botId
 * Get the latest telemetry reading for a bot (protected)
 */
const getLatestTelemetry = async (req, res, next) => {
  try {
    const { botId } = req.params;

    // Verify the bot belongs to this user
    const bot = await Bot.findOne({ botId, owner: req.user._id });
    if (!bot) {
      return sendError(res, 403, 'You do not have access to this bot.');
    }

    const latest = await Telemetry.findOne({ botId }).sort({ createdAt: -1 });

    if (!latest) {
      return sendSuccess(res, 200, { telemetry: null }, 'No telemetry data yet');
    }

    sendSuccess(res, 200, { telemetry: latest });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:botId
 * Get historical telemetry logs for a bot (protected)
 */
const getReports = async (req, res, next) => {
  try {
    const { botId } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    // Verify the bot belongs to this user
    const bot = await Bot.findOne({ botId, owner: req.user._id });
    if (!bot) {
      return sendError(res, 403, 'You do not have access to this bot.');
    }

    const logs = await Telemetry.find({ botId })
      .sort({ createdAt: -1 })
      .limit(limit);

    sendSuccess(res, 200, { logs, total: logs.length });
  } catch (err) {
    next(err);
  }
};

module.exports = { postTelemetry, getLatestTelemetry, getReports };
