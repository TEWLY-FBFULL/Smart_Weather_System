const db = require('../models/connectDB'); // import connectDB

// Check if posts exists in twitter_posts table
const checkPostsExists = (tweetId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(*) AS count FROM twitter_posts WHERE tweet_id = ?`;
        db.query(query, [tweetId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0].count > 0); // return true
        });
    });
};

// Format date to Thai timezone
const formatDateToThai = (isoString) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 7); // Timezone UTC+7
    return date.toISOString().slice(0, 19).replace("T", " ");
};

// Insert data to twitter_posts table
const insertTwitterPosts = async (keyw_id, posts, tweet_username) => {
    try {
        // Validate if tweet_id already exists
        const exists = await checkPostsExists(posts.id);
        if (exists) {
            console.log(`โพสต์ใน X ซ้ำ: ${posts.id} ถูกข้าม`);
            return "Duplicate posts skipped";
        }
        // Convert date to Thai timezone
        const post_time_at = formatDateToThai(posts.created_at);
        // Insert data to twitter_posts table
        const query = `INSERT INTO twitter_posts 
            (tweet_id, keyw_id, tweet_username, tweet, post_time_at) 
            VALUES (?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.query(query, [posts.id, keyw_id, tweet_username,
            posts.text, post_time_at
            ], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        throw error;
    }
};

// Select new X posts data from twitter_posts table
const getLatestXposts = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                CAST(tweet_id AS CHAR) AS tweet_id, 
                tweet_username, 
                tweet, 
                post_time_at
            FROM twitter_posts 
            ORDER BY tweet_created_at DESC 
            LIMIT 6
        `;
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


module.exports = { insertTwitterPosts, getLatestXposts }