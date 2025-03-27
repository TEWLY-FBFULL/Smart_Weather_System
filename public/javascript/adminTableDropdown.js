async function getTableWithTableName() {
    const dropdown = document.getElementById("tabledb");
    const columnName = document.querySelector(".recentOrders table thead");
    const content = document.getElementById("adminLogTable");
    try {
        const response = await fetch(`http://localhost:3000/api/admin/tables/${dropdown.value}`, {
            method: "GET",
            credentials: "include",
        });
        const result = await response.json();
        console.log("Table:", result);
        if (response.ok) {
            columnName.innerHTML = "";
            content.innerHTML = "";
            // Object Mapping
            const tableConfig = {
                roles: {
                    columns: ["ID", "Role", "Created At", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.role_id}</td>
                        <td>${data.role_name}</td>
                        <td>${formatDate(data.role_created_at)}</td>
                        ${actionButtons(data.role_id)}
                    `,
                },
                users: {
                    columns: ["ID", "Username", "Email", "Role", "Created At", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.user_id}</td>
                        <td>${data.user_name}</td>
                        <td>${data.email}</td>
                        <td>${data.role_id}</td>
                        <td>${formatDate(data.user_created_at)}</td>
                        ${actionButtons(data.user_id)}
                    `,
                },
                admin_logs: {
                    columns: ["ID", "User ID", "Action", "Created At"],
                    renderRow: (data) => `
                        <td>${data.log_id}</td>
                        <td>${data.user_id}</td>
                        <td>${data.action}</td>
                        <td>${formatDate(data.log_created_at)}</td>
                    `,
                },
                youtube_videos: {
                    columns: ["ID", "City ID", "Keyword ID", "Title", "Channel", "Created At", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.video_id}</td>
                        <td>${data.city_id}</td>
                        <td>${data.keyw_id}</td>
                        <td>${data.title}</td>
                        <td>${data.channel_title}</td>
                        <td>${formatDate(data.yt_created_at)}</td>
                        ${actionButtons(data.video_id)}
                    `,
                },
                keywords: {
                    columns: ["ID", "Keyword", "Created At", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.keyw_id}</td>
                        <td>${data.keyw_name}</td>
                        <td>${formatDate(data.keyw_created_at)}</td>
                        ${actionButtons(data.keyw_id)}
                    `,
                },
                cities: {
                    columns: ["ID", "City Name", "Longitude", "Latitude", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.city_id}</td>
                        <td>${data.city_name_th} / ${data.city_name_en}</td>
                        <td>${data.lon}</td>
                        <td>${data.lat}</td>
                        ${actionButtons(data.city_id)}
                    `,
                },
                weather_reports: {
                    columns: ["ID", "City ID", "Weather ID", "Temp", "Humidity", "Wind Speed", "Created At", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.report_id}</td>
                        <td>${data.city_id}</td>
                        <td>${data.wedesc_id}</td>
                        <td>${data.rep_temp} °C</td>
                        <td>${data.rep_humidity} %</td>
                        <td>${data.rep_wind_speed} m/s</td>
                        <td>${formatDate(data.report_created_at)}</td>
                        ${actionButtons(data.report_id)}
                    `,
                },
                weather_forecasts: {
                    columns: ["ID", "City ID", "Weather ID", "Temp", "Humidity", "Wind Speed", "Forecast Date", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.forecast_id}</td>
                        <td>${data.city_id}</td>
                        <td>${data.wedesc_id}</td>
                        <td>${data.fore_temp} °C</td>
                        <td>${data.fore_humidity} %</td>
                        <td>${data.fore_wind_speed} m/s</td>
                        <td>${data.forecast_date}</td>
                        ${actionButtons(data.forecast_id)}
                    `,
                },
                weather_description: {
                    columns: ["ID", "Description (TH)", "Description (EN)", "Created At", "Edit", "Delete"],
                    renderRow: (data) => `
                        <td>${data.wedesc_id}</td>
                        <td>${data.weather_desc_th}</td>
                        <td>${data.weather_desc_en}</td>
                        <td>${formatDate(data.wedesc_created_at)}</td>
                        ${actionButtons(data.wedesc_id)}
                    `,
                },
            };
            const config = tableConfig[dropdown.value];
            if (!config) {
                console.warn("No configuration found for table:", dropdown.value);
                return;
            }
            columnName.innerHTML = `<tr>${config.columns.map(col => `<td>${col}</td>`).join("")}</tr>`;
            result.forEach(data => {
                const row = document.createElement("tr");
                row.innerHTML = config.renderRow(data);
                content.appendChild(row);
            });
            addEventListeners();
        } else {
            Swal.fire("เกิดข้อผิดพลาด!", "กรุณาลองใหม่", "error");
        }
    } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error");
        console.error("Error:", error);
    }
}
// Format Date
const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
};
//  Edit and Delete
const actionButtons = (id) => `
    <td><button class="btn edit-btn" data-id="${id}">Edit</button></td>
    <td><button class="btn delete-btn" data-id="${id}">Delete</button></td>
`;
// Add Event Listener for Edit and Delete Buttons
const addEventListeners = () => {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            Swal.fire("Edit", "Edit function not implemented yet", "info");
        });
    });
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const dropdown = document.getElementById("tabledb");
            const id = this.getAttribute("data-id");
            Swal.fire({
                title: "คุณแน่ใจหรือไม่?",
                text: "ข้อมูลนี้จะถูกลบอย่างถาวร!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await fetch(`http://localhost:3000/api/admin/tables/${dropdown.value}/${id}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    Swal.fire("ลบสำเร็จ!", "ข้อมูลถูกลบแล้ว", "success");
                    location.reload();
                }
            });
        });
    });
};

export { getTableWithTableName };
