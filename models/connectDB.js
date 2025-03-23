// Import MySQL2
const mysql = require('mysql2');
require('dotenv').config();

// Create connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: "Z", // UTC
});
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log(`Connected to ${process.env.DB_NAME}`);

    // timezone +07:00
    db.query("SET time_zone = '+07:00';", (err) => {
        if (err) {
            console.error("Error setting timezone:", err);
        } else {
            console.log("Timezone set to +07:00");
        }
    });
});
// Export db
module.exports = db;