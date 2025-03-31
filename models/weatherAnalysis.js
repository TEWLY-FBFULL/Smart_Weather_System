const db = require('../models/connectDB'); // import connectDB

// Insert weather analysis results
const insertWeatherAnalysis = (report_id, source_type, youtube, userpost, similarity) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO weather_analysis_results (report_id, source_type, 
            source_id_youtube, source_id_userpost, similarity) 
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [report_id, source_type, youtube, userpost, similarity], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

// Search weather analysis table
const selectWeatherAnalysisTable = () => {
    return new Promise((resolve, reject) => {
        const query = `CALL get_latest_weather_analysis();`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
};

module.exports = { insertWeatherAnalysis, selectWeatherAnalysisTable};