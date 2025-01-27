const bcrypt = require('bcrypt'); // hash

// Compare User Password
const comparePassword = async (password, hash ) =>{
    try{
        return await bcrypt.compare(password, hash);
    }catch(err){
        throw new Error('เกิดข้อผิดพลาดในการเปรียบเทียบรหัสผ่าน');
    }
}

module.exports = comparePassword;