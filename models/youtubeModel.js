const db = require('../models/connectDB'); // import connectDB

// Check if video exists in youtube_videos table
const checkVideoExists = (videoId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(*) AS count FROM youtube_videos WHERE video_id = ?`;
        db.query(query, [videoId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0].count > 0); // return true
        });
    });
};

// Insert data to youtube_videos table
const insertYoutubeVideos = async (keyw_id, city_id, video) => {
    try {
        // Validate if video_id already exists
        const exists = await checkVideoExists(video.id.videoId);
        if (exists) {
            console.log(`วิดีโอซ้ำ: ${video.id.videoId} ถูกข้าม`);
            return "Duplicate video skipped";
        }
        // Insert data to youtube_videos table
        const query = `INSERT INTO youtube_videos 
            (video_id, city_id, keyw_id, description, channel_title, title, video_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.query(query, [video.id.videoId, city_id, keyw_id, video.snippet.description,
                video.snippet.channelTitle, video.snippet.title, video.snippet.thumbnails.high.url
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

// Select new videos data from youtube_videos table
const getLatestYoutubeVideos = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * 
            FROM youtube_videos 
            ORDER BY yt_created_at DESC 
            LIMIT 5
        `;
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


module.exports = { insertYoutubeVideos, getLatestYoutubeVideos }