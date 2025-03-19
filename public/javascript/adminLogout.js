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
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include", // Cookie (JWT)
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire('ออกจากระบบสำเร็จ!', '', 'success').then(() => {
                window.location.href = 'http://localhost:3000';
            });
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}