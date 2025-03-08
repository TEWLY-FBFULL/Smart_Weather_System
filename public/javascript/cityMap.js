// API
let map = null;

async function  createCityMap(cityname,lat,lon,weather,temp,humidity) {
    const provinces = [
        {
            name: cityname,
            lat: lat,
            lon: lon,
            weather: weather,
            temp: temp,
            humidity: humidity
        }
    ];

    // Check the temperature mode
    const tempMode = localStorage.getItem("temperature") || "C";
    const displayTemp = tempMode === "F" ? `${temp}°F` : `${temp}°C`;

    // set up the map
    if (map !== null) {
        map.remove();
    }
    
    map = L.map('map').setView([lat, lon], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // add a marker and popup
    provinces.forEach(province => {
        L.marker([province.lat, province.lon]).addTo(map)
            .bindPopup(`
                <b>${province.name}</b><br>
                Weather: ${province.weather}<br>
                Temperature: ${displayTemp}<br>
                Humidity: ${province.humidity}%
            `);
    });
}

export { createCityMap };