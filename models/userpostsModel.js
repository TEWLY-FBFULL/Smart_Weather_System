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

// Select new posts data from user_posts table
const getLatestUserPostsWithCityID = (city_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * 
            FROM user_posts 
            WHERE city_id = ?  
            AND CONVERT_TZ(post_created_at, '+00:00', '+07:00') >= NOW() - INTERVAL 1 DAY
            ORDER BY post_created_at DESC;
        `;
        db.query(query, [city_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = { insertUserPosts, getLatestUserPostsWithCityID };