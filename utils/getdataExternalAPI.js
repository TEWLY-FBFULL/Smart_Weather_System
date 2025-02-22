const { selectCityID,getdataFromOpenWeatherMapAPI,selectWeatherDescriptionID,insertWeatherReport } = require("../models/weatherModel");

// Function to update weather for major cities
async function updateWeatherForCity(city) {
    try {
        // Search for city in database
        const cityResult = await selectCityID(city);
        if (cityResult.length === 0) {
            console.error(`ไม่พบเมือง ${city} ในฐานข้อมูล`);
            return;
        }
        const city_id = cityResult[0].city_id;
        // Get data from OpenWeatherMap API
        const weatherData = await getdataFromOpenWeatherMapAPI(city);
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
        console.log(`อัปเดตข้อมูลสภาพอากาศของ ${city} สำเร็จ! จะอัปเดตในอีก 1 ชั่วโมง`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Function to update weather for all major cities every 1 hour
function updateWeatherForCities() {
    const hour = 3600000; // 1h
    const majorCities = ["Bangkok", "Chiang Mai", "Phuket", "Songkhla", "Udon Thani", "Krabi"];
    // Start by updating weather for all major cities
    majorCities.forEach(city => updateWeatherForCity(city));
    // Set interval to update weather for all major cities every 1 hour
    setInterval(() => {
        majorCities.forEach(city => updateWeatherForCity(city));
    }, hour);
}

module.exports = { updateWeatherForCities };


