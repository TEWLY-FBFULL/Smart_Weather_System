const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/jwtCheckRole');
const { userHome } = require('../controllers/main_user');

router.get('/user/index',verifyToken,userHome); // manage user home

module.exports = router;