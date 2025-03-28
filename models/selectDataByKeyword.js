const db = require("./connectDB");

const searchQueries = {
    roles: "SELECT * FROM roles WHERE role_id LIKE ? OR role_name LIKE ?",
    cities: "SELECT * FROM cities WHERE city_id LIKE ? OR city_name_th LIKE ? OR city_name_en LIKE ?",
    keywords: "SELECT * FROM keywords WHERE keyw_id LIKE ? OR keyw_name LIKE ?",
    weather_description: "SELECT * FROM weather_description WHERE wedesc_id LIKE ? OR weather_desc_th LIKE ? OR weather_desc_en LIKE ?",
    users: `
        SELECT users.*, roles.role_name 
        FROM users 
        LEFT JOIN roles ON users.role_id = roles.role_id 
        WHERE users.user_id LIKE ? OR users.user_name LIKE ? OR users.email LIKE ? OR roles.role_name LIKE ?`,
    user_posts: `
        SELECT user_posts.*, users.user_name, cities.city_name_th, cities.city_name_en
        FROM user_posts
        LEFT JOIN users ON user_posts.user_id = users.user_id
        LEFT JOIN cities ON user_posts.city_id = cities.city_id
        WHERE user_posts.user_id LIKE ? OR users.user_name LIKE ? OR cities.city_name_th LIKE ? OR cities.city_name_en LIKE ?`,
    admin_logs: `
        SELECT admin_logs.*, users.user_name, roles.role_name
        FROM admin_logs
        LEFT JOIN users ON admin_logs.user_id = users.user_id
        LEFT JOIN roles ON users.role_id = roles.role_id
        WHERE users.user_name LIKE ? OR roles.role_name LIKE ? OR admin_logs.action LIKE ?`,
    youtube_videos: `
        SELECT youtube_videos.*, cities.city_name_th, cities.city_name_en, keywords.keyw_name
        FROM youtube_videos
        LEFT JOIN cities ON youtube_videos.city_id = cities.city_id
        LEFT JOIN keywords ON youtube_videos.keyw_id = keywords.keyw_id
        WHERE cities.city_name_th LIKE ? OR cities.city_name_en LIKE ? OR youtube_videos.title LIKE ? OR youtube_videos.channel_title LIKE ?`,
    weather_reports: `
        SELECT weather_reports.*, cities.city_name_th, cities.city_name_en, weather_description.weather_desc_th, weather_description.weather_desc_en
        FROM weather_reports
        LEFT JOIN cities ON weather_reports.city_id = cities.city_id
        LEFT JOIN weather_description ON weather_reports.wedesc_id = weather_description.wedesc_id
        WHERE cities.city_name_th LIKE ? OR cities.city_name_en LIKE ? OR weather_description.weather_desc_th LIKE ? OR weather_description.weather_desc_en LIKE ? OR weather_reports.report_created_at LIKE ?`,
    weather_forecasts: `
        SELECT weather_forecasts.*, cities.city_name_th, cities.city_name_en, weather_description.weather_desc_th, weather_description.weather_desc_en
        FROM weather_forecasts
        LEFT JOIN cities ON weather_forecasts.city_id = cities.city_id
        LEFT JOIN weather_description ON weather_forecasts.wedesc_id = weather_description.wedesc_id
        WHERE cities.city_name_th LIKE ? OR cities.city_name_en LIKE ? OR weather_description.weather_desc_th LIKE ? OR weather_description.weather_desc_en LIKE ? OR weather_forecasts.forecast_date LIKE ? OR weather_forecasts.forecast_time LIKE ?`
};

// Select data by keyword
const selectDataByKeyword = (table, query) => {
    return new Promise((resolve, reject) => {
        const sql = searchQueries[table];
        if (!sql) {
            console.warn(`No SQL query found for table: ${table}`);
            return resolve([]);
        }
        // Safely calculate the number of placeholders
        const placeholderCount = (sql.match(/\?/g) || []).length;
        // Validate query and prepare values
        if (typeof query !== 'string' || query.trim() === '') {
            console.warn(`Invalid query provided: ${query}`);
            return resolve([]);
        }
        const values = Array(placeholderCount).fill(`${query}%`);
        // Execute the query
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(`Database query failed: ${err.message}`);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


module.exports = { selectDataByKeyword };