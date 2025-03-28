const path = require('path');
const { getServerStats } = require('../utils/getServerStatus');
const { selectAllUser, selectUserTable } = require('../models/usersModel');
const { insertAdminLogs, selectAdminLogsTable } = require('../models/adminLogModel');
const { selectRolesTable } = require('../models/roleModel');
const { searchCityTable } = require('../models/cityModel');
const { selectKeywordTable } = require('../models/keywordModel');
const { selectWeatherDescriptionTable, selectWeatherReportsTable } = require('../models/weatherModel');
const { selectWeatherForecastsTable } = require('../models/forecastModel');
const { selectUserPostsTable } = require('../models/userpostsModel');
const { selectYoutubeVideosTable } = require('../models/youtubeModel');
const { deleteDataInTable } = require('../models/deleteData');
const { selectDataByID } = require('../models/selectDataByID');
const { updateDataByID } = require('../models/updateDataByID');
const { insertData } = require('../models/insertDataInTable');
const { selectDataByKeyword } = require('../models/selectDataByKeyword');

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
        const logs = await selectAdminLogsTable();
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
        else if (table === "users"){ result = await selectUserTable(); }
        else if (table === "user_posts"){ result = await selectUserPostsTable(); }
        else if (table === "admin_logs"){ result = await selectAdminLogsTable(); }
        else if (table === "youtube_videos"){ result = await selectYoutubeVideosTable(); }
        else if (table === "weather_reports"){ result = await selectWeatherReportsTable(); }
        else if (table === "weather_forecasts"){ result = await selectWeatherForecastsTable(); }
        else { return res.status(400).json({ error: "Invalid table name" });}
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
            await insertAdminLogs(req.user.user_id, `ลบข้อมูล`);
            res.json(result);} 
        else { res.status(400).json({ error: "Invalid table name" });}
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
}

exports.updateTable = async (req, res) => {
    try {
        const { table, id } = req.params;
        const updateData = req.body;
        // Check if table name is valid
        const allowedTables = {
            roles: "role_id",
            cities: "city_id",
            keywords: "keyw_id",
            weather_description: "wedesc_id"
        };
        if (!allowedTables[table]) {
            return res.status(400).json({ error: "ตารางนี้ไม่รองรับการเเก้ไข" });
        }
        const primaryKey = allowedTables[table];
        const result = await updateDataByID(table, id, primaryKey, updateData);
        await insertAdminLogs(req.user.user_id, `เเก้ไขข้อมูล`);
        res.json({ message: "Update successful", result });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
};

exports.getTableById = async (req, res) => {
    try {
        const { table, id } = req.params;
        // Check if table name is valid
        const allowedTables = {
            roles: "role_id",
            cities: "city_id",
            keywords: "keyw_id",
            weather_description: "wedesc_id"
        };
        if (!allowedTables[table]) {
            return res.status(400).json({ error: "ตารางนี้ไม่รองรับการเเก้ไข" });
        }
        const primaryKey = allowedTables[table];
        const getdata = await selectDataByID(table, id, primaryKey);
        if (getdata.length === 0) {
            return res.status(404).json({ error: "ไม่พบข้อมูล" });
        }
        res.json(getdata[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.insertTable = async (req, res) => {
    try {
        const { table } = req.params;
        const newData = req.body;

        if (!table || Object.keys(newData).length === 0) {
            return res.status(400).json({ error: "ไม่พบข้อมูล" });
        }
        const result = await insertData(table, newData);
        await insertAdminLogs(req.user.user_id, `เพิ่มข้อมูล`);
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.searchTable = async (req, res) => {
    try {
        const { table } = req.params;
        const { query } = req.query;
        if (!query) {
            return res.json({ data: [] });
        }
        const search = await selectDataByKeyword(table, query);
        res.json({ data: search });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
