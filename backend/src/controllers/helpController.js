const HelpRequest = require('../models/HelpRequest');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/help
 * Submit a help/contact request
 */
const submitHelp = async (req, res, next) => {
  try {
    const { name, phone, message, village } = req.body;

    const helpRequest = await HelpRequest.create({
      name,
      phone,
      message,
      village: village || '',
      submittedBy: req.user ? req.user._id : null,
    });

    sendSuccess(res, 201, { helpRequest }, 'Your request has been submitted. We will contact you soon.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/help
 * Get all help requests submitted by the current user
 */
const getMyHelp = async (req, res, next) => {
  try {
    const requests = await HelpRequest.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, { requests });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitHelp, getMyHelp };
