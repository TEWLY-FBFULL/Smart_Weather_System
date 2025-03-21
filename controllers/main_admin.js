const path = require('path');
const { getServerStats } = require('../utils/getServerStatus');
const { selectAllUser } = require('../models/usersModel');
const { insertAdminLogs } = require('../models/adminLogModel');

exports.adminHome = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/adminDashboard.html'));
};

exports.serverstatus = async (req, res) => {
    try {
        const stats = await getServerStats();
        res.json(stats);
    } catch (error) {
        console.error("Error fetching server stats:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.userData = async (req, res) => {
    try{
        const users = await selectAllUser();
        res.json(users);
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Logout
exports.logout = async (req,res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(400).json({ error: 'คุณยังไม่ได้เข้าสู่ระบบ' });
        }
        // Insert admin log
        if (req.user?.user_id) {
            await insertAdminLogs(req.user.user_id, 'ออกจากระบบ');
        }
        // Clear Cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        });
        res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ error: "Server error" });
    }
};
