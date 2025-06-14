# 🌤️ Smart Weather System

ระบบ Smart Weather System พัฒนาขึ้นเพื่อจัดการและแสดงข้อมูลสภาพอากาศในประเทศไทยทั้ง 77 จังหวัด โดยรวมการดึงข้อมูลจาก API และให้ผู้ใช้สามารถเพิ่มข้อมูลที่เกี่ยวข้องได้ด้วยตัวเองผ่านระบบเว็บแอปพลิเคชัน

[🎬 ดูวิดีโอสาธิตระบบ (YouTube)](https://www.youtube.com/watch?v=x_xYv5QKPCM&t=749s)

---

## 🧠 ฟีเจอร์หลัก

- 📡 ดึงข้อมูลสภาพอากาศเรียลไทม์จาก API
- 🗺️ รองรับทั้ง 77 จังหวัดในประเทศไทย
- 👤 ระบบผู้ใช้งาน: ดูข้อมูลสภาพอากาศเเละเพิ่มโพสต์ที่เกี่ยวข้องได้
- 🛠️ ฝั่ง Admin สามารถจัดการสิทธิ์และดูภาพรวมระบบได้
- 📈 แสดงกราฟวิเคราะห์ข้อมูล เช่น อุณหภูมิ, ความชื้น, ฝนตก

---

## 🌐 เทคโนโลยีที่ใช้

- Frontend | HTML, CSS, JavaScript |
- Backend | Node.js, Express.js |
- Database | MySQL |
- API | OpenWeatherMap, YouTubeAPI |

---

📸 ตัวอย่างหน้าจอระบบ

ภาพต่อไปนี้แสดงให้เห็นอินเทอร์เฟซการใช้งานของระบบ Smart Weather System ในแต่ละมุมมองหลัก ได้แก่ การเข้าสู่ระบบ, หน้าผู้ดูแลระบบ, และโครงสร้างการออกแบบระบบ

🔐 หน้าเข้าสู่ระบบ (Login Page)
ระบบมีหน้า Login สำหรับยืนยันตัวตนผู้ใช้งานก่อนเข้าถึงฟังก์ชันภายในระบบ

<p align="center"> <img src="./screenshots/exloginpage.png" alt="Login Page 1" width="500"/> </p> <p align="center"> <img src="./screenshots/ex2loginpage.png" alt="Login Page 2" width="500"/> </p>

⚙️ หน้าผู้ดูแลระบบ (Admin Page)
ผู้ดูแลระบบสามารถจัดการข้อมูลผู้ใช้, ข้อมูลสภาพอากาศ, และตรวจสอบภาพรวมของระบบได้

<p align="center"> <img src="./screenshots/exadminpage.png" alt="Admin Dashboard 1" width="500"/> </p> <p align="center"> <img src="./screenshots/ex2adminpage.png" alt="Admin Dashboard 2" width="500"/> </p>

👤 หน้าใช้งานของผู้ใช้ (User Page)
ผู้ใช้สามารถดูข้อมูลสภาพอากาศเเละคลิปวิดีโอ YouTube, เพิ่มข้อมูลโพสต์ที่เกี่ยวข้องกับสภาพอากาศ, ดูการวิเคราะห์เชิงกราฟ เช่น อุณหภูมิ, ความชื้น ฯลฯ ตามช่วงเวลาได้

<p align="center"> <img src="./screenshots/exuserpage.png" alt="User Page 1" width="500"/> </p> <p align="center"> <img src="./screenshots/ex2userpage.png" alt="User Page 2" width="500"/> </p>

🧱 Conceptual Design
โมเดล Conceptual แสดงภาพรวมของระบบในระดับแนวคิดก่อนออกแบบฐานข้อมูล

<p align="center"> <img src="./screenshots/conceptualDesign.png" alt="Conceptual Design" width="500"/> </p>

🧩 Physical Design (ER Diagram)
ภาพด้านล่างแสดงโครงสร้างฐานข้อมูลในระดับ Physical ซึ่งระบุรายละเอียดของแต่ละตาราง เช่น ชนิดข้อมูล, คีย์หลัก (Primary Key), ความสัมพันธ์ และข้อจำกัด (Constraints) ระหว่าง Entity ต่าง ๆ ในระบบ

<p align="center"> <img src="./screenshots/finER.png" alt="Physical Design" width="500"/> </p>

---
