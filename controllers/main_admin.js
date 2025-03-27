const path = require('path');
const { getServerStats } = require('../utils/getServerStatus');
const { selectAllUser } = require('../models/usersModel');
const { insertAdminLogs, selectAllAdminLogs } = require('../models/adminLogModel');
const { selectRolesTable } = require('../models/roleModel');
const { searchCityTable } = require('../models/cityModel');
const {selectKeywordTable} = require('../models/keywordModel');
const { selectWeatherDescriptionTable } = require('../models/weatherModel');
const { deleteDataInTable } = require('../models/deleteData');

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

exports.adminlogs = async (req,res) => {
    try{
        const logs = await selectAllAdminLogs();
        res.json(logs);
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
}

exports.adminHomeP2 = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/adminDashboard2.html'));
};

exports.getTable = async (req, res) => {
    try{
        const table = req.params.table;
        if (!table) {  return res.status(400).json({ error: 'Invalid table' });}
        let result = null;
        if (table === "roles"){ result = await selectRolesTable(); }
        else if (table === "cities"){ result = await searchCityTable(); }
        else if (table === "keywords"){ result = await selectKeywordTable(); }
        else if (table === "weather_description"){ result = await selectWeatherDescriptionTable(); }
        res.json(result);
    }
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
}

exports.deleteDatainTable = async (req, res) => {
    try{
        const table = req.params.table;
        const id = req.params.id;
        if (!table || !id) {  return res.status(400).json({ error: 'Invalid data' });}
        let result = null;
        let column = null;
        // Check table name
        if (table === "roles") { column = "role_id"; } 
        else if (table === "cities") { column = "city_id"; } 
        else if (table === "keywords") { column = "keyw_id"; } 
        else if (table === "weather_description") { column = "wedesc_id"; } 
        else if (table === "admin_logs") { column = "log_id"; } 
        else if (table === "youtube_videos") { column = "video_id"; } 
        else if (table === "users") { column = "user_id"; } 
        else if (table === "user_posts") { column = "post_id"; } 
        else if (table === "weather_reports") { column = "report_id"; } 
        else if (table === "weather_forecasts") { column = "forecast_id"; }

        if (column) { result = await deleteDataInTable(table, id, column);
            res.json(result);} 
        else { res.status(400).json({ error: "Invalid table name" });}
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
}

