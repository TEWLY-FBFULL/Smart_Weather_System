const db = require('../models/connectDB'); // import connectDB

// Insert user_posts
const insertUserPosts = (user_id, city_id, post_text) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO user_posts (user_id, city_id, post_text) 
        VALUES (?, ?, ?)`;
        db.query(query, [user_id, city_id, post_text], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = { insertUserPosts };