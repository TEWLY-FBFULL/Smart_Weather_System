const path = require('path');

exports.adminHome = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin/adminDashboard.html'));
};