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
const selectAllAdminLogs = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT us.user_name, ro.role_name, ad.action, ad.log_created_at	
            FROM admin_logs AS ad
            INNER JOIN users AS us ON ad.user_id = us.user_id
            INNER JOIN roles AS ro ON us.role_id = ro.role_id
            ORDER BY ad.log_created_at DESC
            LIMIT 10
        `;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


module.exports = { insertAdminLogs, selectAllAdminLogs };