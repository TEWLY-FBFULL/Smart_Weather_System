const path = require('path');

exports.userHome = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/user/weatherData.html'));
};
