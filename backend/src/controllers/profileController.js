const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/profile
 * Get the current user's farmer profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }
    sendSuccess(res, 200, { profile: user });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/profile
 * Create or update the farmer profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, village, district, state, cropsGrown } = req.body;

    const allowedFields = {};
    if (name !== undefined) allowedFields.name = name;
    if (phone !== undefined) allowedFields.phone = phone;
    if (village !== undefined) allowedFields.village = village;
    if (district !== undefined) allowedFields.district = district;
    if (state !== undefined) allowedFields.state = state;
    if (cropsGrown !== undefined) {
      // Accept comma-separated string or array
      allowedFields.cropsGrown = Array.isArray(cropsGrown)
        ? cropsGrown
        : cropsGrown.split(',').map((c) => c.trim()).filter(Boolean);
    }

    // Mark profile as complete if key fields are filled
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...allowedFields,
        profileComplete: !!(allowedFields.phone || req.user.phone) &&
          !!(allowedFields.village || req.user.village),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return sendError(res, 404, 'User not found.');
    }

    sendSuccess(res, 200, { profile: updatedUser }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
