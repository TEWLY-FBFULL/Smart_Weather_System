const db = require("./connectDB"); // import connectDB

// Search city_name with city_id
const selectCityNameWithID = (city_id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT city_name_th FROM cities WHERE city_id = ?';
        db.query(query, city_id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Search city by city name
const searchCityWithName = (city_name) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT city_name_th FROM cities WHERE city_name_th LIKE ?';
        db.query(query, [`${city_name}%`], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.map(row => row.city_name_th));
            }
        });
    });
};

// Search city by city full name
const searchCityWithFullName = (city_name) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT city_id,city_name_th,lon,lat FROM cities WHERE city_name_th = ?';
        db.query(query, city_name, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Search city table
const searchCityTable = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM cities LIMIT 77';
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


module.exports = { selectCityNameWithID,searchCityWithName,searchCityWithFullName,searchCityTable };