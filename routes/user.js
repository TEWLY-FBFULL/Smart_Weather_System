const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/jwtCheckRole');
const { userHome,userProfile } = require('../controllers/main_user');

router.get('/user/index',verifyUser,userHome); // manage user home
router.get('/user/profile',verifyUser,userProfile); // manage user profile

module.exports = router;