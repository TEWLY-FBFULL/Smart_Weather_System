const path = require('path');
const { getServerStats } = require('../utils/getServerStatus');
const { selectAllUser } = require('../models/usersModel');

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
