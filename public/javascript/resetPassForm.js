document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    document.getElementById("token").value = token;

    document.getElementById("resetPasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const password = document.getElementById("password").value;
        const confirm_password = document.getElementById("confirm_password").value;

        if (!token) {
            Swal.fire({
                title: "ลิงก์ไม่ถูกต้อง!",
                text: "ลิงก์หมดอายุหรือไม่ถูกต้อง",
                icon: "error",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/resetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password, confirm_password }),
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "เปลี่ยนรหัสผ่านสำเร็จ!",
                    text: result.message,
                    icon: "success",
                    confirmButtonText: "ตกลง"
                }).then(() => {
                    window.location.href = "/"; // go back to login page
                });
            } else {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: result.error || "กรุณาลองใหม่",
                    icon: "error",
                    confirmButtonText: "ตกลง"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
                icon: "error",
                confirmButtonText: "ตกลง"
            });
            console.error("Error:", error);
        }
    });
});
