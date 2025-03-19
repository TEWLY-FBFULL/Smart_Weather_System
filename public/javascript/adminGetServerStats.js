async function getServerStats() {
    try{
        const response = await fetch("http://localhost:3000/api/admin/serverstatus", {
            method: "GET",
            credentials: "include", // Cookie (JWT)
        });
        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            document.getElementById("server-cpu").innerText = `${result.cpu.usage.currentLoad.toFixed(0)}%`;
            document.getElementById("server-ram").innerText =` ${Number(result.memory.usagePercent).toFixed(0)}%`;
            document.getElementById("server-disk").innerText = `${Number(result.disk[1].usagePercent).toFixed(0)}%`;
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

export { getServerStats };