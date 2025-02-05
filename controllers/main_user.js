const path = require('path');

exports.userHome = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user/weatherData.html'));
};

exports.userProfile = async (req, res) => {
    try {
        const userData = {
            user_id: req.user.user_id,
            user_name: req.user.user_name,
            email: req.user.email,
            role_id: req.user.role_id
        };
        res.json({ success: true, user: userData });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
    }
}
