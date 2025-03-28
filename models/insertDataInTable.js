const db = require("./connectDB");

const insertData = (table_name, insertData) => {
    return new Promise((resolve, reject) => {
        if (!insertData || Object.keys(insertData).length === 0) {
            return reject(new Error("No data provided for insert"));
        }
        // SQL INSERT Dynamic Query 
        const columns = Object.keys(insertData).map(col => `\`${col}\``).join(", ");
        const placeholders = Object.keys(insertData).map(() => "?").join(", ");
        const values = Object.values(insertData);

        const query = `INSERT INTO \`${table_name}\` (${columns}) VALUES (${placeholders})`;

        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ insertId: result.insertId, message: "Insert successful" });
            }
        });
    });
};

module.exports = { insertData };
