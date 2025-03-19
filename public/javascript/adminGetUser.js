async function getUser() {
    try{
        const response = await fetch("http://localhost:3000/api/admin/userdata", {
            method: "GET",
            credentials: "include", // Cookie (JWT)
        });
        const result = await response.json();
        console.log("result:", result);
        if (response.ok) {
            document.getElementById("user-num").innerText = `${result.length}`;

            const table = document.querySelector(".recentCustomers table");
            table.innerHTML = "";
            result.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td width="50px">
                        <div class="imgBx"><img src="/img/user2.png" alt=""></div>
                    </td>
                    <td>
                        <h4>${user.user_name} <br><span>${user.email}</span></h4>
                    </td>
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

export { getUser };