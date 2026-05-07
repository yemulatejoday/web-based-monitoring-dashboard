const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email already exists.');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    sendSuccess(res, 201, { token, user }, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, 404, 'No account found with this email. Please register first.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Incorrect password. Please try again.');
    }

    const token = generateToken(user._id);

    // Return user without password
    const userObj = user.toJSON();

    sendSuccess(res, 200, { token, user: userObj }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Get current logged-in user
 */
const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, 200, { user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
