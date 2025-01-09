const bcrypt = require('bcrypt'); // hash

const hashpassword = async (password) => {
    try {
        return await bcrypt.hash(password, 13);
    } catch (err) {
        throw new Error('เกิดข้อผิดพลาดในการแฮชรหัสผ่าน');
    }
};

module.exports = hashpassword;
