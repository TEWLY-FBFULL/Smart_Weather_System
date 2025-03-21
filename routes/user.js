const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/jwtCheckRole');
const { userHome,userProfile,searchCity,getWeatherdataWithCityname,
    contactMe,insertPost,postWeather,logout } = require('../controllers/main_user');

router.get('/user/index',verifyUser,userHome); // manage user home
router.get('/user/profile',verifyUser,userProfile); // manage user profile
router.get('/user/search',verifyUser,searchCity); // manage search city
router.get('/user/weatherdataofcity',verifyUser,getWeatherdataWithCityname); // manage select city
router.get('/user/insertpost',verifyUser,insertPost); // manage insert post form
router.post('/user/contactMe',verifyUser,contactMe); // manage contact me
router.post('/user/postWeather',verifyUser,postWeather); // manage update post
router.post('/user/logout',verifyUser,logout); // user logout 

module.exports = router;