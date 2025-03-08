// แปลง °C เป็น °F
function convertToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// ดึงโหมดอุณหภูมิจาก localStorage
function getTemperatureMode() {
    return localStorage.getItem("temperature") || "C";
}

// อัปเดตอุณหภูมิใน UI
function updateTemperature(result) {
    const mode = getTemperatureMode();
    const temperatureEl = document.querySelector(".tem-fromAPI");

    if (temperatureEl) {
        const temp = mode === "F" ? convertToFahrenheit(result.weather.rep_temp).toFixed(0) : result.weather.rep_temp.toFixed(0);
        const unit = mode === "F" ? "°F" : "°C";
        temperatureEl.innerHTML = `${temp}${unit}`;
    }

    document.dispatchEvent(new Event("temperatureUpdated"));
}

// ตั้งค่าปุ่มเปลี่ยนหน่วย
const toggle_tem = document.getElementById("toggle-tem");
if (toggle_tem) {
    toggle_tem.innerText = getTemperatureMode();
    toggle_tem.addEventListener("click", () => {
        const newMode = getTemperatureMode() === "C" ? "F" : "C";
        localStorage.setItem("temperature", newMode);
        toggle_tem.innerText = newMode;
        document.dispatchEvent(new Event("temperatureModeChanged"));
    });
}

const toggleTemp = document.getElementById("toggle-tem-icon");

// ตรวจสอบค่าใน localStorage
if (localStorage.getItem("temperature") === "F") {
    toggleTemp.innerText = "°F";
} else {
    toggleTemp.innerText = "°C";
}

// ฟังก์ชันสลับหน่วยอุณหภูมิ
function switchTemperature() {
    let currentMode = localStorage.getItem("temperature") || "C";
    let newMode = currentMode === "C" ? "F" : "C";

    // บันทึกค่าใหม่
    localStorage.setItem("temperature", newMode);
    toggleTemp.innerText = newMode === "C" ? "°C" : "°F";

    // Trigger event ให้ UI อัปเดต
    document.dispatchEvent(new Event("temperatureModeChanged"));
}

// Event listener สำหรับปุ่ม
toggleTemp.addEventListener("click", switchTemperature);


export { updateTemperature, getTemperatureMode, convertToFahrenheit };
