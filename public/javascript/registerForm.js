document.querySelector("#registerForm").addEventListener("submit", async function (event) {
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
