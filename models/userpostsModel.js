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
            SELECT UP.user_id, U.user_name, UP.post_text, 
            UP.post_created_at, UP.post_id
            FROM user_posts AS UP
            INNER JOIN users AS U ON UP.user_id = U.user_id
            WHERE UP.city_id = ?  
            AND UP.post_created_at >= NOW() - INTERVAL 1 DAY
            ORDER BY UP.post_created_at DESC;
        `;
        db.query(query, [city_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Select user_posts table
const selectUserPostsTable = () => {
    return new Promise((resolve, reject) => {
        const query = `CALL get_user_posts();`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result[0]);
        });
    });
};

module.exports = { insertUserPosts, getLatestUserPostsWithCityID, selectUserPostsTable };