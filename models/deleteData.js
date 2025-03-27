const db = require("./connectDB");

// Delete data from table
const deleteDataInTable = (table_name, id, id_name) => {
    return new Promise((resolve, reject) => {
        const allowedTables = ["users", "roles", "admin_logs", "youtube_videos", 
            "keywords", "cities", "weather_reports", "weather_forecasts", 
            "weather_description", "user_posts"];

        if (!allowedTables.includes(table_name)) {
            return reject(new Error("Invalid table name!"));
        }
        const query = `DELETE FROM \`${table_name}\` WHERE \`${id_name}\` = ?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


module.exports = { deleteDataInTable };