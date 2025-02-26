const db = require("./connectDB");

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


module.exports = { selectWeatherDescriptionID, insertWeatherReport };