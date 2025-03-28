const db = require('../models/connectDB'); // import connectDB

// Search roles table
const selectRolesTable = () => {
    return new Promise((resolve, reject) => {
        const query = 'CALL get_roles();';
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
};

module.exports = { selectRolesTable };