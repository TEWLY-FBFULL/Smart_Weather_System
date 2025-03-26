const db = require('../models/connectDB'); // import connectDB

// Search roles table
const selectRolesTable = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM roles LIMIT 10';
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { selectRolesTable };