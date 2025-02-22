const fetch = require("node-fetch");
const db = require("./connectDB");
require("dotenv").config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Search for city in database
const selectCityID = (city) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT city_id FROM cities WHERE city_name_en = ?';
        db.query(query, city, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Get data from OpenWeatherMap API
const getdataFromOpenWeatherMapAPI = async (city) => {
    try {
        const apiResponse = await fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const weatherData = await apiResponse.json();
        return weatherData;
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
    }
}

// Search for weather description in database
const selectWeatherDescriptionID = (description) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT wedesc_id FROM weather_desc WHERE weather_desc_en = ?';
        db.query(query, description, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Insert data to weather report table
const insertWeatherReport = (weatherReportData) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO weather_reports 
        (city_id, wedesc_id, rep_temp, rep_humidity, rep_temp_min, rep_temp_max, rep_wind_speed) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [weatherReportData.city_id, weatherReportData.desc_id, weatherReportData.temp  
            , weatherReportData.humidity, weatherReportData.temp_min, weatherReportData.temp_max, 
            weatherReportData.windspeed
        ], 
        (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


module.exports = { selectCityID, getdataFromOpenWeatherMapAPI, selectWeatherDescriptionID, insertWeatherReport };