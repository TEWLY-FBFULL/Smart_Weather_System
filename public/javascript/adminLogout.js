const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    Swal.fire({
        title: 'คุณต้องการออกจากระบบหรือไม่?',
        text: 'หากออกจากระบบ คุณต้องเข้าสู่ระบบใหม่!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            logoutUser();
        }
    });
});

async function logoutUser() {
    try {
        const response = await fetch("http://localhost:3000/api/admin/logout", {
            method: "POST",
            credentials: "include", // Cookie with request
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "เกิดข้อผิดพลาดในการออกจากระบบ");
        }
        Swal.fire('ออกจากระบบสำเร็จ!', '', 'success').then(() => {
            window.location.href = 'http://localhost:3000';
        });
    } catch (error) {
        console.error("Error logging out:", error);
        Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
    }
}