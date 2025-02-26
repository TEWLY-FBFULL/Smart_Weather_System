const db = require('../models/connectDB'); // import connectDB

// Search keyword id from keyword
const selectKeywordNamewithID = (keyw_id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT keyw_name FROM keywords WHERE keyw_id = ?';
        db.query(query, keyw_id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { selectKeywordNamewithID };