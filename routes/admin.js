const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/jwtCheckRole');
const { adminHome,serverstatus,userData } = require('../controllers/main_admin');
const { userProfile } = require('../controllers/main_user');

router.get('/admin/index',verifyAdmin,adminHome); // manage admin dashboard
router.get('/admin/profile',verifyAdmin,userProfile); // manage admin profile
router.get('/admin/serverstatus',verifyAdmin,serverstatus); // get server status
router.get('/admin/userdata',verifyAdmin,userData); // get all user data

module.exports = router;