const db = require("./connectDB");

// Select data by ID from a table
const selectDataByID = (table_name, id, id_name) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM \`${table_name}\` WHERE \`${id_name}\` = ?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


module.exports = { selectDataByID };