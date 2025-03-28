const db = require("./connectDB");

// Search for weather description in database
const selectWeatherDescriptionID = (description) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT wedesc_id FROM weather_description WHERE weather_desc_en = ?';
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
            SELECT 
            wr.report_created_at AS local_time,
            wd.weather_desc_th,
            wr.rep_temp,
            wr.rep_humidity,
            wr.rep_temp_min,
            wr.rep_temp_max,
            wr.rep_wind_speed,
            wr.city_id
            FROM weather_reports wr
            INNER JOIN weather_description wd ON wr.wedesc_id = wd.wedesc_id 
            WHERE wr.city_id = ? 
            AND wr.report_created_at >= NOW() - INTERVAL 1 HOUR
            ORDER BY wr.report_created_at DESC 
            LIMIT 1;
        `;
        db.query(query, [cityID], (err, results) => {
            if (err) return reject(err);
            resolve(results.length ? results[0] : null);
        });
    });
};

// Search weather description table
const selectWeatherDescriptionTable = () => {
    return new Promise((resolve, reject) => {
        const query = 'CALL get_weather_description();';
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
};

// Search weather reports table
const selectWeatherReportsTable = () => {
    return new Promise((resolve, reject) => {
        const query = `CALL get_weather_reports();`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
};


module.exports = { selectWeatherDescriptionID, insertWeatherReport
    , getLatestWeatherReportWithCityID, selectWeatherDescriptionTable, selectWeatherReportsTable };