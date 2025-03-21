const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/jwtCheckRole');
const { adminHome,serverstatus,userData,logout } = require('../controllers/main_admin');

router.get('/admin/index',verifyAdmin,adminHome); // manage admin dashboard
router.get('/admin/serverstatus',verifyAdmin,serverstatus); // get server status
router.get('/admin/userdata',verifyAdmin,userData); // get all user data
router.post('/admin/logout',verifyAdmin,logout); // admin logout

module.exports = router;