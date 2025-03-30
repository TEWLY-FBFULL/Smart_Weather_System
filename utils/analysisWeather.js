const axios = require("axios");
require('dotenv').config(); // import .env
const { getLatestYoutubeVideosWithCityID } = require('../models/youtubeModel');
const FASTAPI_URL = process.env.FASTAPI_URL;

// Analyze text using FastAPI
async function analyzeTextWithFastAPI(text1, text2) {
    try {
        const response = await axios.post(FASTAPI_URL, { text1, text2 });
        return response.data.similarity; // Output from FastAPI
    } catch (error) {
        console.error("Error calling FastAPI:", error.message);
        return 0; // If no response similarity = 0
    }
}

async function processWeatherData(latestWeather, youtubeVideos, userPosts) {
    let relevantYouTube = [];
    let relevantUserPosts = [];
    let analysisResults = [];
    // Get the latest weather description
    const weatherDescription = latestWeather.weather_desc_th;
    // Loop check YouTube videos
    for (const video of youtubeVideos) {
        try {
            const videoText = `${video.title} ${video.description}`;
            const similarity = await analyzeTextWithFastAPI(weatherDescription, videoText);

            if (similarity >= 0.6) {
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
    // Loop check User Posts
    for (const post of userPosts) {
        try {
            const similarity = await analyzeTextWithFastAPI(weatherDescription, post.post_text);

            if (similarity >= 0.6) {
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
    // Check if there are any relevant YouTube videos or user posts
    userPosts = relevantUserPosts.length >= 2 ? relevantUserPosts : null;
    youtubeVideos = relevantYouTube.length >= 3 ? relevantYouTube : await getLatestYoutubeVideosWithCityID(78);
    const youtubeType = relevantYouTube.length >= 3 ? "weather_related" : "general_news";
    return {
        youtubeVideos,
        userPosts,
        analysisResults,
        youtubeType,
    };
}

module.exports = { processWeatherData };
