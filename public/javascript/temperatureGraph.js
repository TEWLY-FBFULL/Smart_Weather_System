import {convertToFahrenheit, getTemperatureMode} from "./temperatureMode.js";

async function createGraph(todayForecast) {
    const mode = getTemperatureMode();
    const ctx = document.getElementById('weatherChart').getContext('2d');

    if (!ctx) {console.error("Canvas not found!");return;}

    const labels = todayForecast.map(item => item.forecast_time.slice(0, 5));
    const data = mode === "F" ? todayForecast.map(item => convertToFahrenheit(item.fore_temp)) 
    : todayForecast.map(item => item.fore_temp);

    // Delete old chart if exists
    if (window.myChart instanceof Chart) {window.myChart.destroy();}

    // Create new chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ช่วงเวลาสภาพอากาศวันนี้',
                data: data,
                backgroundColor: '#ffa99c',
                borderColor: '#ff7e67',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true, // แสดง legend
                    labels: {
                        color: "#ffa99c", 
                        font: { size: 18 } 
                    }
                }
            } 
        }
    });
}

export { createGraph };
