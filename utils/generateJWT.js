const jwt = require('jsonwebtoken'); // import JWT
require('dotenv').config(); // import .env

/**
 * Generate JWT token
 * @param {string | number} user_id - User ID to embed in the token
 * @returns {string} - JWT token
 */
const generateJWTtoken = (user_id,user_name,email,role_id) => {
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const payload = {
        user_id, // Embed user ID in token
        user_name,
        email,
        role_id
    };
    return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = generateJWTtoken;
