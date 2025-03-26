const path = require('path');
const { searchCityWithName, searchCityWithFullName } = require('../models/cityModel');
const { getLatestWeatherReportWithCityID } = require('../models/weatherModel');
const { getLatestWeatherForecastWithCityID } = require('../models/forecastModel');
const { getLatestYoutubeVideosWithCityID } = require('../models/youtubeModel');
const { insertUserPosts, getLatestUserPostsWithCityID } = require('../models/userpostsModel');
const { insertAdminLogs } = require('../models/adminLogModel');
const { isWeatherRelated } = require('../models/keywordModel');
const { sendEmail, validateUserSendEmail, validatePostWeather, getPopularCities } = require("../utils");
const { mainGetWeather, mainGetWeatherForeCast, mainGetYoutubeVideo } = require("../utils/mainGetAPI");
const { getEmbedding, cosineSimilarity } = require("../utils/analysisWeather");

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
        const { city_id, city_name_th: city_name, lon, lat } = city[0];
        // Get latest weather, forecast, youtube videos, user posts
        let [latestWeather, latestForecast, youtubeVideos, userPost, popularCity] = await Promise.all([
            getLatestWeatherReportWithCityID(city_id),
            getLatestWeatherForecastWithCityID(city_id),
            getLatestYoutubeVideosWithCityID(city_id),
            getLatestUserPostsWithCityID(city_id),
            getPopularCities()
        ]);
        console.log({ latestWeather, latestForecast, youtubeVideos});
        // Check if data is outdated
        const now = new Date();
        const isOutdated = (lastUpdate, hours) => 
            !lastUpdate || (now - new Date(lastUpdate)) / (1000 * 60 * 60) >= hours;
        const isWeatherOutdated = isOutdated(latestWeather?.local_time, 1);
        const isForecastOutdated = isOutdated(latestForecast?.[0]?.local_datetime, 24);
        const isYoutubeVideoOutdated = isOutdated(youtubeVideos?.[0]?.yt_created_at, 24);
        // Update data if outdated
        if (isWeatherOutdated) {
            await mainGetWeather(city_id, city_name);
            latestWeather = await getLatestWeatherReportWithCityID(city_id);
        }
        if (isForecastOutdated) {
            await mainGetWeatherForeCast(city_id, city_name);
            latestForecast = await getLatestWeatherForecastWithCityID(city_id);
        }
        if (isYoutubeVideoOutdated) {
            // await mainGetYoutubeVideo(city_id, city_name);
            youtubeVideos = await getLatestYoutubeVideosWithCityID(city_id);
        }
        // Analysis weather data
        let relevantYouTube = [], relevantUserPosts = [], analysisResults = [];
        if (youtubeVideos.length > 0 || userPost.length > 0) {
            const weatherVec = await getEmbedding(latestWeather.weather_desc_th);

            for (const video of youtubeVideos) {
                try {
                    const videoText = `${video.title} ${video.description}`;
                    const youtubeVec = await getEmbedding(videoText);
                    const similarity = await cosineSimilarity(weatherVec, youtubeVec);
                    console.log("Weather Vec:", weatherVec);
                    console.log("YouTube Vec:", youtubeVec);

                    if (!isNaN(similarity) && similarity >= 0.5) {
                        relevantYouTube.push(video);
                        analysisResults.push({
                            source: "YouTube",
                            reference: video.title,
                            similarity: similarity.toFixed(2),
                        });
                    }
                } catch (error) {
                    console.error("Error processing YouTube video:", error);
                }
            }
            console.log(relevantYouTube);
            for (const post of userPost) {
                try {
                    if (!(await isWeatherRelated(post.post_text))) continue;

                    const postVec = await getEmbedding(post.post_text);
                    const similarity = await cosineSimilarity(weatherVec, postVec);
                    console.log("Weather Vec:", weatherVec);
                    console.log("User Post Vec:", postVec);

                    if (!isNaN(similarity) && similarity >= 0.5) {
                        relevantUserPosts.push(post);
                        analysisResults.push({
                            source: "UserPost",
                            reference: post.post_text,
                            similarity: similarity.toFixed(2),
                        });
                    }
                } catch (error) {
                    console.error("Error processing User Post:", error);
                }
            }     
            console.log(relevantUserPosts);       
        }
        // Limit data to 3 items
        userPost = relevantUserPosts.length >= 2 ? relevantUserPosts : null;
        youtubeVideos = relevantYouTube.length >= 3 ? relevantYouTube : await getLatestYoutubeVideosWithCityID(78);
        const youtubeType = relevantYouTube.length >= 3 ? "weather_related" : "general_news";
        // Send response
        res.json({
            city: { city_id, city_name, lon, lat },
            weather: latestWeather,
            forecast: latestForecast,
            popularCity,
            youtubeVideos: { type: youtubeType, videos: youtubeVideos },
            userPosts: userPost,
            analysis: analysisResults
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
        await insertAdminLogs(user_id, 'เพิ่มโพสต์');
        res.status(201).json({ message: "โพสต์ของคุณถูกบันทึกเรียบร้อยแล้ว" });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Logout
exports.logout = async (req, res) => {
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
