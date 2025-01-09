// Export all the utility functions
const hashpassword = require('./hashpassUser');
const generateToken = require('./emailtokenUser');
const sendEmail = require('./sendEmail');
const validateUser = require('./validateUsers');

module.exports = { hashpassword, generateToken, sendEmail, validateUser };