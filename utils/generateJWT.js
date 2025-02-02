const jwt = require('jsonwebtoken'); // import JWT
require('dotenv').config(); // import .env

/**
 * Generate JWT token
 * @param {string | number} userId - User ID to embed in the token
 * @returns {string} - JWT token
 */
const generateJWTtoken = (userId,username,email,role) => {
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const payload = {
        userId, // Embed user ID in token
        username,
        email,
        role
    };
    return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = generateJWTtoken;
