function getWeatherIcon(desc) {
    if (desc.includes("ท้องฟ้าแจ่มใส")) {
        return "/img/sunny.png";
    } else if (desc.includes("เมฆเล็กน้อย") || desc.includes("เมฆกระจาย") 
        || desc.includes("เมฆแตก") || desc.includes("เมฆครึ้ม") || desc.includes("หมอกควัน")) {
        return "/img/clouds.png";
    } else if (desc.includes("ฝนตกพรำ") || desc.includes("ฝนตกปานกลาง") || desc.includes("ฝนตกหนักสุดๆ") 
        || desc.includes("ฝนตกหนัก") || desc.includes("ฝนตกหนักมาก") || desc.includes("ฝนเยือกแข็ง")
        || desc.includes("ฝนปรอยๆ เบาๆ") || desc.includes("ฝนตกเป็นระยะ") || desc.includes("ฝนตกหนักเป็นระยะ")) {
        return "/img/rain.png";
    } else if (desc.includes("พายุฝนฟ้าคะนอง") || desc.includes("พายุฝนฟ้าคะนองพร้อมฝนเบา") 
        || desc.includes("พายุฝนฟ้าคะนองพร้อมฝน") || desc.includes("พายุฝนฟ้าคะนองพร้อมฝนหนัก")) {
        return "/img/storm.png"; 
    } else {
        return "/img/sunny.png";
    }
}

export { getWeatherIcon }; // export the function
