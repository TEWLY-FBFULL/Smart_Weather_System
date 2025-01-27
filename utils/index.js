// Export all the utility functions
const hashpassword = require('./hashpassUser');
const generateToken = require('./emailtokenUser');
const sendEmail = require('./sendEmail');
const validateUser = require('./validateUsers');
const comparePassword = require('./compareUserpass');
const generateJWTtoken = require('./generateJWT');

module.exports = { hashpassword, generateToken, sendEmail, validateUser, comparePassword, generateJWTtoken };