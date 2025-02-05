const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/jwtCheckRole');
const { adminHome } = require('../controllers/main_admin');

router.get('/admin/index',verifyAdmin,adminHome); // manage user home

module.exports = router;