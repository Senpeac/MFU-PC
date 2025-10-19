const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a given user ID.
 * @param {string} userId - MongoDB ObjectId string
 * @returns {string} signed JWT token
 */
module.exports = function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
