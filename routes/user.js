const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/jwtCheckRole');
const { userHome,userProfile,searchCity,getWeatherdataWithCityname,contactMe } = require('../controllers/main_user');

router.get('/user/index',verifyUser,userHome); // manage user home
router.get('/user/profile',verifyUser,userProfile); // manage user profile
router.get('/user/search',verifyUser,searchCity); // manage search city
router.get('/user/weatherdataofcity',verifyUser,getWeatherdataWithCityname); // manage select city
router.post('/user/contactMe',verifyUser,contactMe); // manage contact me

module.exports = router;