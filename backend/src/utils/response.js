/**
 * Standardized success response helper
 */
const sendSuccess = (res, statusCode = 200, data = {}, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized error response helper
 */
const sendError = (res, statusCode = 400, message = 'An error occurred') => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = { sendSuccess, sendError };
