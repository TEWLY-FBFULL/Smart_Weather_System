const express = require('express');
const router = express.Router();
const { userHome } = require('../controllers/main_user');
// ,verifyToken
router.get('/user/index',userHome);

module.exports = router;