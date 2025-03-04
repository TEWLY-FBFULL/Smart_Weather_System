const db = require("./connectDB");
const util = require("util");
const { selectWeatherDescriptionID } = require("./weatherModel");

const queryAsync = util.promisify(db.query).bind(db);

// Filter forecast data to get only 6 times a day
async function filterForecastData(forecastList) {
    const requiredTimes = ["06:00:00", "09:00:00", "12:00:00", "15:00:00", "18:00:00", "21:00:00"];
    return forecastList.filter(forecast => {
        const time = forecast.dt_txt.split(" ")[1];
        return requiredTimes.includes(time);
    });
}

// Insert forecast data to weather_forecasts table
const insertWeatherForecast = (forecastData) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO weather_forecasts 
        (city_id, wedesc_id, forecast_date, forecast_time, fore_temp, fore_temp_min, fore_temp_max, fore_humidity, fore_wind_speed) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [
            forecastData.city_id,
            forecastData.wedesc_id,
            forecastData.forecast_date,
            forecastData.forecast_time,
            forecastData.fore_temp,
            forecastData.fore_temp_min,
            forecastData.fore_temp_max,
            forecastData.fore_humidity,
            forecastData.fore_wind_speed
        ],(err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

// Process forecast entry
async function processForecastEntry(city_id, forecast) {
    try {
        const [forecast_date, forecast_time] = forecast.dt_txt.split(" ");
        const { temp, temp_min, temp_max, humidity } = forecast.main;
        const wind_speed = forecast.wind.speed;
        const description = forecast.weather[0].description;

        // Search for weather description in database
        const weatherDescResult = await selectWeatherDescriptionID(description);
        if (weatherDescResult.length === 0) {
            console.error(`ไม่พบสภาพอากาศ ${description} ในฐานข้อมูล`);
            return;
        }
        const wedesc_id = weatherDescResult[0].wedesc_id;
        // Insert forecast data to weather_forecasts table
        await insertWeatherForecast({
            city_id,
            wedesc_id,
            forecast_date,
            forecast_time,
            fore_temp: temp,
            fore_temp_min: temp_min,
            fore_temp_max: temp_max,
            fore_humidity: humidity,
            fore_wind_speed: wind_speed
        });
        console.log(`อัปเดตพยากรณ์อากาศ วันที่ ${forecast_date} เวลา ${forecast_time} สำเร็จ!`);
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
    }
}

// Delete old forecasts
async function deleteOldForecasts() {
    try {
        const sql = `DELETE FROM weather_forecasts`;
        const result = await queryAsync(sql);
        console.log(`ล้างข้อมูลพยากรณ์อากาศทั้งหมดสำเร็จ`);
        return result;
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการล้างข้อมูล:", err);
        throw err;
    }
}

// Check time for city
const getLatestWeatherForecastWithCityID = (cityID) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT CONVERT_TZ(forecast_created_at, '+00:00', '+07:00') AS local_datetime,
                CAST(forecast_date AS CHAR) AS local_date,
                forecast_time, fore_temp, fore_temp_min, fore_temp_max, fore_humidity, fore_wind_speed
            FROM weather_forecasts 
            WHERE city_id = ?  
            AND DATE(CONVERT_TZ(forecast_created_at, '+00:00', '+07:00')) = 
            (SELECT DATE(CONVERT_TZ(MAX(forecast_created_at), '+00:00', '+07:00')) 
            FROM weather_forecasts WHERE city_id = ?)  
            ORDER BY forecast_date ASC, CAST(forecast_time AS TIME) ASC;
        `;
        db.query(query, [cityID, cityID], (err, results) => {
            if (err) return reject(err);
            resolve(results.length ? results : null);
        });
    });
};


module.exports = { filterForecastData, processForecastEntry, deleteOldForecasts, getLatestWeatherForecastWithCityID };