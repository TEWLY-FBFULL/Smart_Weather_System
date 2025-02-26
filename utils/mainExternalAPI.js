const { selectWeatherDescriptionID,insertWeatherReport } = require("../models/weatherModel");
const { filterForecastData, processForecastEntry, deleteOldForecasts } = require("../models/forecastModel");
const { selectCityNameWithID } = require("../models/cityModel");
const { selectKeywordNamewithID } = require("../models/keywordModel");
const { insertYoutubeVideos } = require("../models/youtubeModel");
const { insertTwitterPosts } = require("../models/xpostModel");
const { openweathermapAPI,youtubeV3API,XpostV2API } = require("./allExternalAPI");

const majorCities = [1, 38, 66, 70, 29, 64];
let pathapi = "";

// Function to update weather for major cities
async function updateWeatherForCity(city_id) {
    try {
        // Search for city in database
        const cityResult = await selectCityNameWithID(city_id);
        if (cityResult.length === 0) {
            console.error(`ไม่พบเมือง ID = ${city_id} ในฐานข้อมูล`);
            return;
        }
        const city_name_th = cityResult[0].city_name_th;
        // Get data from OpenWeatherMap API
        pathapi = `http://api.openweathermap.org/data/2.5/weather?q=${city_name_th}&units=metric&appid=`;
        const weatherData = await openweathermapAPI(pathapi);
        const description = weatherData.weather[0].description;
        // Search for weather description in database
        const weatherDescResult = await selectWeatherDescriptionID(description);
        if (weatherDescResult.length === 0) {
            console.error(`ไม่พบสภาพอากาศ ${description} ในฐานข้อมูล`);
            return;
        }
        const desc_id = weatherDescResult[0].wedesc_id;
        const weatherReportData = {
            city_id: city_id,
            desc_id: desc_id,
            temp: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            temp_min: weatherData.main.temp_min,
            temp_max: weatherData.main.temp_max,
            windspeed: weatherData.wind.speed
        };
        // Insert data to weather report
        await insertWeatherReport(weatherReportData);
        console.log(`อัปเดตข้อมูลสภาพอากาศของ ${city_name_th} สำเร็จ! จะอัปเดตในอีก 1 ชั่วโมง`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Function to update forecast for major cities
async function updateForecastForCity(city_id) {
    try {
        // Search for city in database
        const cityResult = await selectCityNameWithID(city_id);
        if (cityResult.length === 0) {
            console.error(`ไม่พบเมือง ID = ${city_id} ในฐานข้อมูล`);
            return;
        }
        const city_name_th = cityResult[0].city_name_th;
        // Get forecast data from OpenWeatherMap API
        pathapi = `http://api.openweathermap.org/data/2.5/forecast?q=${city_name_th}&units=metric&appid=`;
        const weatherData = await openweathermapAPI(pathapi);
        // Filter forecast data
        const filteredForecasts = await filterForecastData(weatherData.list);
        // Manage forecast data
        for (const forecast of filteredForecasts) {
            await processForecastEntry(city_id, forecast);
        }
        console.log(`อัปเดตพยากรณ์อากาศของ ${city_name_th} สำเร็จ!`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Function to update Youtube videos with keywords
async function updateYoutubeVideo() {
    try {
        const keyw_id = 2;
        // Search for keywords in database
        const keywordResult = await selectKeywordNamewithID(keyw_id);
        if (keywordResult.length === 0) {
            console.error(`ไม่พบคีย์เวิร์ด ID = ${keyw_id} ในฐานข้อมูล`);
            return;
        }
        const keyw_name = keywordResult[0].keyw_name;
        // Get Youtube videos data from Youtube API
        pathapi = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyw_name}&type=video&order=date&key=`;
        const videosData = await youtubeV3API(pathapi);
        for (const video of videosData.items) {
            await insertYoutubeVideos(keyw_id, video);
        }
        console.log(`อัปเดตข้อมูล youtube สำเร็จ!`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Function to update X posts with keywords
async function updateXpost() {
    try {
        const keyw_id = 1;
        // Search for keywords in database
        const keywordResult = await selectKeywordNamewithID(keyw_id);
        if (keywordResult.length === 0) {
            console.error(`ไม่พบคีย์เวิร์ด ID = ${keyw_id} ในฐานข้อมูล`);
            return;
        }
        const keyw_name = keywordResult[0].keyw_name;
        // Get X Posts data from X V2 API
        pathapi = `https://api.twitter.com/2/tweets/search/recent?query=${keyw_name}%20ประเทศไทย%20lang:th%20-is:retweet&max_results=100&tweet.fields=created_at,author_id,text&expansions=author_id&user.fields=username`;
        const xPostData = await XpostV2API(pathapi);
        for (const x of xPostData.data) {
            // Check between id and author_id
            const user = xPostData.includes.users.find(y => y.id === x.author_id);
            if (user) {
                await insertTwitterPosts(keyw_id, x, user.username);
            } else {
                console.log(`ไม่พบ username ของบัญชี X สำหรับโพสต์ ID: ${x.id}`);
            }
        }
        console.log(`อัปเดตข้อมูล X สำเร็จ!`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Function to update weather for all major cities every 1 hour
function updateWeatherForCities() {
    const hour = 3600000; // 1h
    majorCities.forEach(city => updateWeatherForCity(city));
    setInterval(() => {
        majorCities.forEach(city => updateWeatherForCity(city));
    }, hour);
}

// Function to update weather forecast, youtube videos, and X posts for all major cities everyday
async function updateForecastYoutubeX() {
    // Delete all old forecasts before inserting new data
    await deleteOldForecasts();
    const oneday = 86400000; // 1 day
    majorCities.forEach(city => updateForecastForCity(city));
    updateYoutubeVideo();
    updateXpost();
    setInterval(() => {
        majorCities.forEach(city => updateForecastForCity(city));
        updateYoutubeVideo();
        updateXpost();
    }, oneday);
}

module.exports = { updateWeatherForCities, updateForecastYoutubeX };


