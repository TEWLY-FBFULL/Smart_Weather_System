async function createGraph(data) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (!ctx) {
        console.error("Canvas not found!");
        return;
    }

    // Delete old chart if exists
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Create new chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"], // รับ labels จาก data 
            datasets: [{
                label: 'ช่วงเวลาสภาพอากาศ',
                data: [20,30,40,50,60], // รับค่าอุณหภูมิจาก data
                backgroundColor: 'rgba(255, 126, 103, 0.2)',
                borderColor: '#ff7e67',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false 
        }
    });
}

export { createGraph };
