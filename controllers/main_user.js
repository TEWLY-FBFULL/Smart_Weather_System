const path = require('path');
const { searchCityWithName, searchCityWithFullName } = require('../models/cityModel');
const { getLatestWeatherReportWithCityID } = require('../models/weatherModel');
const { getLatestWeatherForecastWithCityID } = require('../models/forecastModel');
const { getLatestYoutubeVideosWithCityID } = require('../models/youtubeModel');
const { insertUserPosts,getLatestUserPostsWithCityID } = require('../models/userpostsModel');
const { insertAdminLogs } = require('../models/adminLogModel');
const { sendEmail, validateUserSendEmail, validatePostWeather, getPopularCities } = require("../utils");
const { mainGetWeather, mainGetWeatherForeCast, mainGetYoutubeVideo } = require("../utils/mainGetAPI");

require('dotenv').config(); // import .env


exports.userHome = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user/weatherData.html'));
};

exports.userProfile = async (req, res) => {
    try {
        const userData = {
            user_id: req.user.user_id,
            user_name: req.user.user_name,
            email: req.user.email,
            role_id: req.user.role_id
        };
        res.json({ success: true, user: userData });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
    }
}

exports.searchCity = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);
        // Search city from database
        const cities = await searchCityWithName(query);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการค้นหาข้อมูล" });
    }
}

exports.getWeatherdataWithCityname = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "กรุณาระบุชื่อเมือง" });

        // Search city from database
        const city = await searchCityWithFullName(query);
        if (city.length === 0) return res.status(404).json({ error: "ไม่พบข้อมูลเมือง" });
        const city_id = city[0].city_id;
        const city_name = city[0].city_name_th;
        const lon = city[0].lon;
        const lat = city[0].lat;

        // Get current all data
        const cityData = {city_id,city_name,lon,lat}
        const latestWeather = await getLatestWeatherReportWithCityID(city_id);
        const latestForecast = await getLatestWeatherForecastWithCityID(city_id);
        const youtubeVideos = await getLatestYoutubeVideosWithCityID(city_id);
        const userPost = await getLatestUserPostsWithCityID(city_id);
        const popularCity = await getPopularCities();
        console.log("latestWeather:", latestWeather);
        console.log("latestForecast:", latestForecast);
        console.log("youtubeVideos:", youtubeVideos);
        console.log("userPost:", userPost);

        // Check current data with time
        const now = new Date();
        let weatherData = latestWeather;
        let forecastData = latestForecast;
        let youtubeVideosData = youtubeVideos;
        let userPostData = userPost;
        // Check if weather or forecast or youtube is outdated
        const lastWeatherUpdate = latestWeather ? new Date(latestWeather.local_time) : null;
        const lastForecastUpdate = latestForecast ? new Date(latestForecast[0].local_datetime) : null;
        const lastYoutubeVideoUpdate = youtubeVideos ? new Date(youtubeVideos[0].yt_created_at) : null;
        const isWeatherOutdated = !lastWeatherUpdate || (now - lastWeatherUpdate) / (1000 * 60 * 60) >= 1;
        const isForecastOutdated = !lastForecastUpdate || (now - lastForecastUpdate) / (1000 * 60 * 60 * 24) >= 1;
        const isYoutubeVideoOutdated = !lastYoutubeVideoUpdate || (now - lastYoutubeVideoUpdate) / (1000 * 60 * 60 * 24) >= 1;

        if (isWeatherOutdated) {
            await mainGetWeather(city_id, city_name);
            weatherData = await getLatestWeatherReportWithCityID(city_id);
        }
        if (isForecastOutdated) {
            await mainGetWeatherForeCast(city_id, city_name);
            forecastData = await getLatestWeatherForecastWithCityID(city_id);
        }
        if (isYoutubeVideoOutdated) {
            await mainGetYoutubeVideo(city_id, city_name);
            youtubeVideosData = await getLatestYoutubeVideosWithCityID(city_id);
        }

        // Response data
        res.json({
            city: cityData,
            weather: weatherData,
            forecast: forecastData,
            popularCity: popularCity,
            youtubeVideos: youtubeVideosData,
        });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.contactMe = async (req, res) => {
    try {
        // Validate data
        const validationError = validateUserSendEmail(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const { name, email, message } = req.body;
        try {
            // Send email
            const to = process.env.RECEIVE_EMAIL;
            const from = process.env.EMAIL;
            const emailSubject = `ข้อความจาก ${name} (${email})`;
            const emailHtml = `<p>${message}</p>`;
            await sendEmail(to, emailSubject, emailHtml, from);
            return res.status(200).json({ message: 'ส่งอีเมลสำเร็จ' });
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({
                message: 'เกิดข้อผิดพลาดในการส่งอีเมล'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.insertPost = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user/insertPostForm.html'));
};

exports.postWeather = async (req, res) => {
    try {
        // Validate
        const validationError = validatePostWeather(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const { city, message } = req.body;
        // Check if city exists
        const cityQuery = await searchCityWithFullName(city);
        if (cityQuery.length === 0) {
            return res.status(404).json({ error: "ไม่พบชื่อเมืองในระบบ" });
        }
        const city_id = cityQuery[0].city_id;
        // Get user_id from token
        const user_id = req.user ? req.user.user_id : null;
        if (!user_id) {
            return res.status(401).json({ error: "กรุณาเข้าสู่ระบบก่อนโพสต์" });
        }        
        // Save post to database
        const insert = await insertUserPosts(user_id, city_id, message);
        if (!insert) {
            return res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกโพสต์" });
        }
        await insertAdminLogs(user_id, 'โพสต์ข้อมูลสภาพอากาศ');
        res.status(201).json({ message: "โพสต์ของคุณถูกบันทึกเรียบร้อยแล้ว" });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Logout
exports.logout = async (req,res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(400).json({ error: 'คุณยังไม่ได้เข้าสู่ระบบ' });
        }
        // Insert admin log
        if (req.user?.user_id) {
            await insertAdminLogs(req.user.user_id, 'ออกจากระบบ');
        }
        // Clear Cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        });
        res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ error: "Server error" });
    }
};
