const fs = require('fs');
const mysql = require('mysql2');

// Create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "",
});
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log(`Connected to DB`);
});

const data = fs.readFileSync('../districts_cityV3.json', 'utf8');
const cities = JSON.parse(data);

const query = `INSERT INTO cities (city_name_th, city_name_en, lon, lat) VALUES (? , ? , ? , ?)`;

for (let i = 0; i<77; i++){
    let show = `${cities[i].id} ${cities[i].city_nameTH} ${cities[i].city_nameEN} ${cities[i].lon} ${cities[i].lat}`;
    db.query(query, [cities[i].city_nameTH, cities[i].city_nameEN, cities[i].lon, cities[i].lat], (err, result) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log(`Add to ${cities[i].city_nameTH}`);
    });
}



