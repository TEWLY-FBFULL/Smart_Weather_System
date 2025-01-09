const db = require('../models/connectDB'); // import connectDB

// Check email and username
const checkEmailAndUsername = (email, user_name) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ? OR user_name = ?';
        db.query(query, [email, user_name], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Insert user
const insertUser = (user_name, email, hashedPassword, email_token, ip_address) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO users (user_name, email, user_password, email_verification_token, ip_address) 
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [user_name, email, hashedPassword, email_token, ip_address], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

// Check email token
const checkEmailToken = (token) => {
    return new Promise((resolve, reject)=>{
        const query = 'SELECT * FROM users WHERE email_verification_token = ?';
        db.query(query, [token], (err, result)=>{
            if(err){
                reject(err);
            }
            if(result.length === 0){
                reject('ไม่มี token นี้ในระบบ');
            }
            resolve(result);
        });
    });
};

// Update email_verified
const updateEmailVerified = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET email_verified = 1, email_verification_token = NULL WHERE user_id = ?';
        db.query(query, [user_id], (err, result) => {
            if (err){
                reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = { checkEmailAndUsername,insertUser,checkEmailToken,updateEmailVerified };