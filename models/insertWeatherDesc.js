const mysql = require('mysql2');

const weather_descriptions_en = [
    "clear sky", "few clouds", "scattered clouds", "broken clouds", "overcast clouds",
    "light rain", "moderate rain", "heavy intensity rain", "very heavy rain", "extreme rain",
    "freezing rain", "light intensity shower rain", "shower rain", "heavy intensity shower rain",
    "thunderstorm", "thunderstorm with light rain", "thunderstorm with rain", "thunderstorm with heavy rain"
];

const weather_descriptions_th = [
    "ท้องฟ้าแจ่มใส", "เมฆเล็กน้อย", "เมฆกระจาย", "เมฆแตก", "เมฆครึ้ม",
    "ฝนตกพรำ", "ฝนตกปานกลาง", "ฝนตกหนัก", "ฝนตกหนักมาก", "ฝนตกหนักสุดๆ",
    "ฝนเยือกแข็ง", "ฝนปรอยๆ เบาๆ", "ฝนตกเป็นระยะ", "ฝนตกหนักเป็นระยะ",
    "พายุฝนฟ้าคะนอง", "พายุฝนฟ้าคะนองพร้อมฝนเบา", "พายุฝนฟ้าคะนองพร้อมฝน", "พายุฝนฟ้าคะนองพร้อมฝนหนัก"
];

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "",
});

db.connect(err => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
        return;
    }
    console.log(`✅ Connected to MySQL Database!`);
});

const query = `INSERT INTO weather_desc (weather_desc_th, weather_desc_en) VALUES (? , ?)`;

for (let i = 0; i < weather_descriptions_en.length; i++) {
    db.query(query, [weather_descriptions_th[i], weather_descriptions_en[i]], (err, result) => {
        if (err) {
            console.error(`❌ Error inserting: ${weather_descriptions_th[i]} - ${err}`);
            return;
        }
        console.log(`✅ Added: ${weather_descriptions_th[i]} - ${weather_descriptions_en[i]}`);
    });
}

db.end();
