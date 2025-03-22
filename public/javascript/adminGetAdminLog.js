async function getAdminLog() {
    try{
        const response = await fetch("http://localhost:3000/api/admin/tables/admin_logs", {
            method: "GET",
            credentials: "include", // Cookie (JWT)
        });
        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            

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

export { getAdminLog };