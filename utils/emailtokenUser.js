const crypto = require('crypto'); // randomBytes

const generateToken = async () => {
    try {
        return crypto.randomBytes(32).toString('hex');
    } catch (err) {
        throw new Error('เกิดข้อผิดพลาดในการสุ่ม Token');
    }
};

module.exports = generateToken;