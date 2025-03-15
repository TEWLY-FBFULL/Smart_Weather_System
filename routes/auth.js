const express = require('express');
const router = express.Router(); // express router
const { login,register,logout,forgetPassword,verifyEmail,resetPassword } = require('../controllers/main_auth'); // import functions

router.post('/auth/login', login); // manage login
router.post('/auth/register', register); // manage register
router.post('/auth/logout', logout); // manage logout
router.post('/auth/forgetPassword', forgetPassword); // manage forget password
router.post('/auth/verifyEmail', verifyEmail); // manage verify email
router.post('/auth/resetPassword', resetPassword); // manage reset password

module.exports = router;