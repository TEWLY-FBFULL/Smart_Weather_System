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

// Search all keyword name
const selectAllKeywordName = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT keyw_name FROM keywords';
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

async function isWeatherRelated(text) {
    const weatherKeywords = await selectAllKeywordName();
    const lowerText = text.toLowerCase();
    const isMatch = weatherKeywords.some(keywordObj => lowerText.includes(keywordObj.keyw_name.toLowerCase()));
    console.log(`Checking "${text}" → ${isMatch}`);
    return isMatch;
}


module.exports = { selectKeywordNamewithID, isWeatherRelated };