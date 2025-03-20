const fetch = require("node-fetch");
require("dotenv").config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const YOUTUBE_V3_API_KEY = process.env.YOUTUBE_V3_API_KEY;

// Get weather and forecast from OpenWeatherMap API
const openweathermapAPI = async (pathapi) => {
    try {
        const apiResponse = await fetch(
            pathapi + OPENWEATHER_API_KEY
        );
        const result = await apiResponse.json();
        return result;
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Get youtube videos from Google Youtube V3 API
const youtubeV3API = async (pathapi) => {
    try {
        const apiResponse = await fetch(
            pathapi + YOUTUBE_V3_API_KEY
        );
        const result = await apiResponse.json();
        return result;
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

module.exports = { openweathermapAPI, youtubeV3API };