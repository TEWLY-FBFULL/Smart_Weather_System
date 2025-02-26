const fetch = require("node-fetch");
require("dotenv").config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const YOUTUBE_V3_API_KEY = process.env.YOUTUBE_V3_API_KEY;
const XPOST_V2_API_KEY = process.env.X_V2_API_KEY;

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

// Get X posts from X API V2 API
const XpostV2API = async (pathapi) => {
    try {
        const apiResponse = await fetch(pathapi, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${XPOST_V2_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        const result = await apiResponse.json();
        return result;
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        return null;
    }
};

module.exports = { openweathermapAPI,youtubeV3API,XpostV2API };