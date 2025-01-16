// API
const provinces = [
    {
        name: "กรุงเทพมหานคร",
        lat: 13.7563,
        lon: 100.5018,
        weather: "Sunny",
        temp: 32,
        humidity: 60
    }
];
// set up the map
const map = L.map('map').setView([13.7563, 100.5018], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// add a marker and popup
provinces.forEach(province => {
    L.marker([province.lat, province.lon]).addTo(map)
        .bindPopup(`
            <b>${province.name}</b><br>
            Weather: ${province.weather}<br>
            Temperature: ${province.temp}°C<br>
            Humidity: ${province.humidity}%
        `);
});