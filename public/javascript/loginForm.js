document.querySelector("#loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    // get form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);
    try {
        // post data to server
        const response = await fetch(event.target.action, {
            method: event.target.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
        // get response from server
        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                title: "สำเร็จ!",
                text: result.message,
                icon: "success",
                confirmButtonText: "ตกลง",
            }).then(() => {
                // Check role
                console.log(result.user_role);
                if (result.user_role === 1) {
                    window.location.href = "http://localhost:3000/api/user/index";
                } else if (result.user_role === 2) {
                    window.location.href = "/api/user/index";
                }
            });
            event.target.reset();
        } else {
            Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
        }
    } catch (error) {
        Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
            icon: "error",
            confirmButtonText: "ตกลง",
        });
        console.error("Error:", error);
    }
});