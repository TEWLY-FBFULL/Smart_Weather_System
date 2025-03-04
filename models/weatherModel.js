const db = require("./connectDB");

// Set timezone to Bangkok
db.query("SET time_zone = '+07:00';", (err) => {
    if (err) console.error("Error setting timezone:", err);
});

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

// Insert data to weather_reports table
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

// Check time for city
const getLatestWeatherReportWithCityID = (cityID) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT CONVERT_TZ(report_created_at, '+00:00', '+07:00') AS local_time,
                   rep_temp,rep_humidity,rep_temp_min,rep_temp_max,rep_wind_speed
            FROM weather_reports 
            WHERE city_id = ? 
            AND CONVERT_TZ(report_created_at, '+00:00', '+07:00') >= NOW() - INTERVAL 1 HOUR
            ORDER BY report_created_at DESC 
            LIMIT 1;
        `;
        db.query(query, [cityID], (err, results) => {
            if (err) return reject(err);
            resolve(results.length ? results[0] : null);
        });
    });
};


module.exports = { selectWeatherDescriptionID, insertWeatherReport, getLatestWeatherReportWithCityID };