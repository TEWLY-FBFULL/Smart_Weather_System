const db = require("./connectDB");

// Update data by ID in a table
const updateDataByID = (table_name, id, id_name, updateData) => {
    return new Promise((resolve, reject) => {
        if (!updateData || Object.keys(updateData).length === 0) {
            return reject(new Error("No data provided for update"));
        }
        // SQL UPDATE Query Dynamic
        const updateFields = Object.keys(updateData).map(key => `\`${key}\` = ?`).join(", ");
        const values = [...Object.values(updateData), id];
        const query = `UPDATE \`${table_name}\` SET ${updateFields} WHERE \`${id_name}\` = ?`;
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else if (result.affectedRows === 0) {
                reject(new Error("No record found to update"));
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { updateDataByID };
