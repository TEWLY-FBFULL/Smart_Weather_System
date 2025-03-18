const path = require('path');
const { searchCityWithName, searchCityWithFullName } = require('../models/cityModel');
const { selectWeatherDescriptionID, insertWeatherReport, 
    getLatestWeatherReportWithCityID } = require('../models/weatherModel');
const { filterForecastData, processForecastEntry,
    getLatestWeatherForecastWithCityID } = require('../models/forecastModel');
const { getLatestYoutubeVideos } = require('../models/youtubeModel');
const { getLatestXposts } = require('../models/xpostModel');
const { sendEmail,validateUserSendEmail } = require("../utils");
const { openweathermapAPI } = require("../utils/allExternalAPI");
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

        const cityData = {
            city_id,
            city_name,
            lon,
            lat
        }

        // Get current data for weather_reports and weather_forecasts
        const latestWeather = await getLatestWeatherReportWithCityID(city_id);
        const latestForecast = await getLatestWeatherForecastWithCityID(city_id);
        console.log("latestWeather:", latestWeather);
        console.log("latestForecast:", latestForecast);

        // Check current data with time
        const now = new Date();
        let weatherData = latestWeather;
        let forecastData = latestForecast;

        // Check if weather or forecast is outdated
        const lastWeatherUpdate = latestWeather ? new Date(latestWeather.local_time) : null;
        const lastForecastUpdate = latestForecast ? new Date(latestForecast[0].local_datetime) : null;
        const isWeatherOutdated = !lastWeatherUpdate || (now - lastWeatherUpdate) / (1000 * 60 * 60) >= 1;
        const isForecastOutdated = !lastForecastUpdate || (now - lastForecastUpdate) / (1000 * 60 * 60 * 24) >= 1;

        if (isWeatherOutdated) {
            // Get data from OpenWeatherMap API
            const pathapi = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=`;
            const newWeatherData = await openweathermapAPI(pathapi);
            const description = newWeatherData.weather[0].description;

            // Search for weather description in database
            const weatherDescResult = await selectWeatherDescriptionID(description);
            if (weatherDescResult.length === 0) {
                return res.status(500).json({ error: `ไม่พบสภาพอากาศ ${description} ในฐานข้อมูล` });
            }
            const desc_id = weatherDescResult[0].wedesc_id;

            // Insert data to weather report
            const weatherReportData = {
                city_id,
                desc_id,
                temp: newWeatherData.main.temp,
                humidity: newWeatherData.main.humidity,
                temp_min: newWeatherData.main.temp_min,
                temp_max: newWeatherData.main.temp_max,
                windspeed: newWeatherData.wind.speed
            };
            await insertWeatherReport(weatherReportData);
            weatherData = await getLatestWeatherReportWithCityID(city_id);
        }

        if (isForecastOutdated) {
            // Get forecast data from OpenWeatherMap API
            const pathapi = `http://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=metric&appid=`;
            const weatherData = await openweathermapAPI(pathapi);

            // Filter forecast data
            const filteredForecasts = await filterForecastData(weatherData.list);

            // Manage forecast data
            for (const forecast of filteredForecasts) {
                await processForecastEntry(city_id, forecast);
            }
            forecastData = await getLatestWeatherForecastWithCityID(city_id);
        }

        // Get data for popular cities
        const getPopularCities = async () => {
            const majorCities = [1, 38, 66, 70, 29, 64];
            const popularCity = await Promise.all(
                majorCities.map(city_id => getLatestWeatherReportWithCityID(city_id)));
            console.log("popularCity:", popularCity);
            return popularCity;
        };
        const popularCity = await getPopularCities();
        // Get new data for youtube_videos and twitter_posts
        const youtubeVideos = await getLatestYoutubeVideos();
        const xPosts = await getLatestXposts();

        // Response data
        res.json({
            city: cityData,
            weather: weatherData,
            forecast: forecastData,
            popularCity: popularCity,
            youtubeVideos: youtubeVideos,
            xPosts: xPosts
        });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.contactMe = async (req, res) => {
    try{
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
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
};
