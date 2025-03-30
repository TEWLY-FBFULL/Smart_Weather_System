const { selectWeatherDescriptionID, insertWeatherReport } = require('../models/weatherModel');
const { filterForecastData, processForecastEntry } = require('../models/forecastModel');
const { selectKeywordNamewithID } = require('../models/keywordModel');
const { insertYoutubeVideos } = require('../models/youtubeModel');
const { openweathermapAPI } = require("./allExternalAPI");
const { youtubeV3API } = require("./allExternalAPI");

async function mainGetWeather(city_id,city_name) {    
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
}

async function mainGetWeatherForeCast(city_id,city_name) {    
    // Get forecast data from OpenWeatherMap API
    const pathapi = `http://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=metric&appid=`;
    const weatherData = await openweathermapAPI(pathapi);
    // Filter forecast data
    const filteredForecasts = await filterForecastData(weatherData.list);
    // Manage forecast data
    for (const forecast of filteredForecasts) {
        await processForecastEntry(city_id, forecast);
    }
}

async function mainGetYoutubeVideo(city_id,city_name) {    
    const keyw_id = 1;
    let pathapi = "";
    // Search for keywords in database
    const keywordResult = await selectKeywordNamewithID(keyw_id);
    if (keywordResult.length === 0) {
        console.error(`ไม่พบคีย์เวิร์ด ID = ${keyw_id} ในฐานข้อมูล`);
        return;
    }
    const keyw_name = keywordResult[0].keyw_name;
    // Get Youtube videos data from Youtube API
    pathapi = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyw_name}%20${city_name}&type=video&order=date&key=`;
    let videosData = await youtubeV3API(pathapi);
    // About 3 videos related to the city
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 3);
    let filteredVideos = videosData.items.filter(video => {
        const publishDate = new Date(video.snippet.publishTime);

        return (
            (video.snippet.title.includes(city_name) || 
            video.snippet.description.includes(city_name)) &&
            publishDate > oneDayAgo
        );
    });
    // If no videos found, use general videos
    if (filteredVideos.length === 0) {
        console.warn(`ไม่มีวิดีโอสำหรับ "${city_name}" หรือวิดีโอเก่ากว่า 1 วัน → กำลังใช้วิดีโอทั่วไป`);
        pathapi = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyw_name}%20ประเทศไทย&type=video&order=date&key=`;
        videosData = await youtubeV3API(pathapi);

        filteredVideos = videosData.items.filter(video => {
            const publishDate = new Date(video.snippet.publishTime);
            return publishDate > oneDayAgo;
        }).slice(0, 3);
        city_id = 78; // Set city_id to Thailand
        city_name = "ประเทศไทย";
    }
    for (const video of filteredVideos) {
        await insertYoutubeVideos(keyw_id, city_id, video);
    }
    console.log(`อัปเดตข้อมูล YouTube สำเร็จสำหรับ "${city_name}"`);
}


module.exports = {mainGetWeather,mainGetWeatherForeCast,mainGetYoutubeVideo};