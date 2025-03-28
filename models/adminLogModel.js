const db = require('../models/connectDB'); // import connectDB

// Insert admin log
const insertAdminLogs = (user_id, action) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO admin_logs(user_id, action) 
            VALUES (?, ?)
        `;
        db.query(query, [user_id,action], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

// Select all admin logs
const selectAdminLogsTable = () => {
    return new Promise((resolve, reject) => {
        const query = `
            CALL get_admin_logs();
        `;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result[0]);
        });
    });
};


module.exports = { insertAdminLogs, selectAdminLogsTable };