async function getTableWithTableName(tableConfig) {
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

// Add Event Listener for Add, Edit and Delete Buttons
const addEventListeners = () => {
    // Edit Button Event Listener
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const id = this.getAttribute("data-id");
            const table = document.getElementById("tabledb").value;
            try {
                // Get Data by ID
                const response = await fetch(`http://localhost:3000/api/admin/tables/${table}/${id}`);
                const data = await response.json();
                if (!response.ok) {
                    Swal.fire("Error", data.error, "error");
                    return;
                }
                if (!data) {
                    Swal.fire("Error", "ไม่พบข้อมูล", "error");
                    return;
                }
                let inputFields = "";
                if (table === "roles") {
                    inputFields = `
                        <label>Role Name</label>
                        <input type="text" id="role_name" class="swal2-input" value="${data.role_name}">
                    `;
                } else if (table === "cities") {
                    inputFields = `
                        <label>City Name (TH)</label>
                        <input type="text" id="city_name_th" class="swal2-input" value="${data.city_name_th}">
                        <br><label>City Name (EN)</label>
                        <input type="text" id="city_name_en" class="swal2-input" value="${data.city_name_en}">
                        <label>Longitude</label>
                        <input type="number" id="lon" class="swal2-input" value="${data.lon}">
                        <label>Latitude</label>
                        <input type="number" id="lat" class="swal2-input" value="${data.lat}">
                    `;
                } else if (table === "keywords") {
                    inputFields = `
                        <label>Keyword Name</label>
                        <input type="text" id="keyw_name" class="swal2-input" value="${data.keyw_name}">
                    `;
                } else if (table === "weather_description") {
                    inputFields = `
                        <label>Description (TH)</label>
                        <input type="text" id="weather_desc_th" class="swal2-input" value="${data.weather_desc_th}">
                        <label>Description (EN)</label>
                        <input type="text" id="weather_desc_en" class="swal2-input" value="${data.weather_desc_en}">
                    `;
                } 
                Swal.fire({
                    title: "แก้ไขข้อมูล",
                    html: inputFields,
                    showCancelButton: true,
                    confirmButtonText: "บันทึก",
                    cancelButtonText: "ยกเลิก",
                    preConfirm: async () => {
                        let updatedData = {};
                        if (table === "roles") {
                            updatedData.role_name = document.getElementById("role_name").value;
                        } else if (table === "cities") {
                            updatedData.city_name_th = document.getElementById("city_name_th").value;
                            updatedData.city_name_en = document.getElementById("city_name_en").value;
                            updatedData.lon = document.getElementById("lon").value;
                            updatedData.lat = document.getElementById("lat").value;
                        } else if (table === "keywords") {
                            updatedData.keyw_name = document.getElementById("keyw_name").value;
                        } else if (table === "weather_description") {
                            updatedData.weather_desc_th = document.getElementById("weather_desc_th").value;
                            updatedData.weather_desc_en = document.getElementById("weather_desc_en").value;
                        }
                        // Update API Call
                        const updateResponse = await fetch(`http://localhost:3000/api/admin/tables/${table}/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedData),
                        });
                        if (!updateResponse.ok) {
                            throw new Error("Update failed");
                        }
                        return updateResponse.json();
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("สำเร็จ!", "ข้อมูลถูกอัปเดตแล้ว", "success").then(() => {
                            location.reload();
                        });
                    }
                });
            } catch (error) {
                console.error("Error:", error);
                Swal.fire("Error", "เกิดข้อผิดพลาด", "error");
            }
        });
    });    
    // Delete Button Event Listener    
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
    // Create Button Event Listener
    document.getElementById("create-btn").addEventListener("click", async function () {
        const table = document.getElementById("tabledb").value;
        let inputFields = "";
        if (table === "roles") {
            inputFields = `
                <label>Role Name</label>
                <input type="text" id="role_name" class="swal2-input">
            `;
        } else if (table === "cities") {
            inputFields = `
                <label>City Name (TH)</label>
                <input type="text" id="city_name_th" class="swal2-input">
                <br><label>City Name (EN)</label>
                <input type="text" id="city_name_en" class="swal2-input">
                <label>Longitude</label>
                <input type="number" id="lon" class="swal2-input">
                <label>Latitude</label>
                <input type="number" id="lat" class="swal2-input">
            `;
        } else if (table === "keywords") {
            inputFields = `
                <label>Keyword Name</label>
                <input type="text" id="keyw_name" class="swal2-input">
            `;
        } else if (table === "weather_description") {
            inputFields = `
                <label>Description (TH)</label>
                <input type="text" id="weather_desc_th" class="swal2-input">
                <label>Description (EN)</label>
                <input type="text" id="weather_desc_en" class="swal2-input">
            `;
        }
        Swal.fire({
            title: "เพิ่มข้อมูลใหม่",
            html: inputFields,
            showCancelButton: true,
            confirmButtonText: "บันทึก",
            cancelButtonText: "ยกเลิก",
            preConfirm: async () => {
                let newData = {};
                if (table === "roles") {
                    newData.role_name = document.getElementById("role_name").value;
                } else if (table === "cities") {
                    newData.city_name_th = document.getElementById("city_name_th").value;
                    newData.city_name_en = document.getElementById("city_name_en").value;
                    newData.lon = document.getElementById("lon").value;
                    newData.lat = document.getElementById("lat").value;
                } else if (table === "keywords") {
                    newData.keyw_name = document.getElementById("keyw_name").value;
                } else if (table === "weather_description") {
                    newData.weather_desc_th = document.getElementById("weather_desc_th").value;
                    newData.weather_desc_en = document.getElementById("weather_desc_en").value;
                }
                // Call API Create
                const createResponse = await fetch(`http://localhost:3000/api/admin/tables/${table}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData),
                });
    
                if (!createResponse.ok) {
                    throw new Error("Create failed");
                }
                return createResponse.json();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("สำเร็จ!", "ข้อมูลถูกเพิ่มแล้ว", "success").then(() => {
                    location.reload();
                });
            }
        });
    });    
};

async function getTableWithKeyword(searchInput, tableConfig) {
    const dropdown = document.getElementById("tabledb");
    const columnName = document.querySelector(".recentOrders table thead");
    const content = document.getElementById("adminLogTable");
    const query = searchInput.value.trim();
    const table = dropdown.value;

    if (!query) {
        content.innerHTML = "";
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/admin/tables/${table}/search?query=${query}`);
        const { data } = await response.json();
        console.log("Results:", data);
        if (!response.ok || !Array.isArray(data)) {
            console.warn("แจ้งเตือน!", "เกิดข้อผิดพลาดหรือข้อมูลไม่ถูกต้อง");
            return;
        }
        if (response.ok) {
            columnName.innerHTML = "";
            content.innerHTML = "";
            // Object Mapping
            const config = tableConfig[dropdown.value];
            if (!config) {
                console.warn("No configuration found for table:", dropdown.value);
                return;
            }
            columnName.innerHTML = `<tr>${config.columns.map(col => `<td>${col}</td>`).join("")}</tr>`;
            data.forEach(data => {
                const row = document.createElement("tr");
                row.innerHTML = config.renderRow(data);
                content.appendChild(row);
            });
            addEventListeners();
        }
    } catch (error) {
        console.log("Error:", error);
    }
}


export { getTableWithTableName, getTableWithKeyword };
