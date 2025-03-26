async function getAdminLog() {
    try{
        const response = await fetch("http://localhost:3000/api/admin/adminlogs", {
            method: "GET",
            credentials: "include", // Cookie (JWT)
        });
        const result = await response.json();
        if (response.ok) {
            console.log("Admin Log:", result);
            const table = document.getElementById("adminLogTable");
            table.innerHTML = "";
            result.forEach(data => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.user_name}</td>
                    <td>${data.role_name}</td>
                    <td>${data.action}</td>
                    <td>${formatDate(data.log_created_at)}</td>
                `;
                table.appendChild(row);
            });
        }else{
            Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: "เกิดข้อผิดพลาด กรุณาลองใหม่",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
        }
    }catch(error){
        Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
            icon: "error",
            confirmButtonText: "ตกลง",
        });
        console.error("Error:", error);
    }
}

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const formatted = date.toISOString().slice(0, 16).replace('T', ' ');
    return formatted;
};

export { getAdminLog };