const axios = require('axios');
const fs = require('fs');

// อ่านข้อมูลจากไฟล์ JSON ที่มีอยู่
const provinces = JSON.parse(fs.readFileSync('api_province.json', 'utf8')); // ชื่อไฟล์ต้นฉบับ

// ฟังก์ชันดึงข้อมูลพิกัด
async function getCoordinates(provinceName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(provinceName)}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0]; // ใช้ข้อมูลตัวแรก
            return { lat, lon };
        } else {
            console.error(`ไม่พบพิกัดสำหรับจังหวัด: ${provinceName}`);
            return { lat: null, lon: null };
        }
    } catch (error) {
        console.error(`Error fetching coordinates for ${provinceName}:`, error.message);
        return { lat: null, lon: null };
    }
}

// ฟังก์ชันประมวลผลจังหวัดทั้งหมด
async function processProvinces() {
    const results = [];

    for (const province of provinces) {
        const provinceName = province.name_th; // ใช้ชื่อภาษาไทย
        console.log(`กำลังดึงข้อมูลสำหรับจังหวัด: ${provinceName}`);

        const coordinates = await getCoordinates(provinceName);
        results.push({
            id: province.id,
            city_nameTH: province.name_th,
            city_nameEN: province.name_en,
            lon: coordinates.lon,
            lat: coordinates.lat
        });
    }

    // เขียนข้อมูลใหม่ลงไฟล์ JSON
    fs.writeFileSync('districts_cityV3.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('การประมวลผลเสร็จสมบูรณ์! ข้อมูลถูกบันทึกลงใน districts_city.json');
}

processProvinces();