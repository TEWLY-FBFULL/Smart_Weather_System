const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/jwtCheckRole');
const { adminHome } = require('../controllers/main_admin');

router.get('/admin/index',verifyToken,adminHome); // manage user home

module.exports = router;