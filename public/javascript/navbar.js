import {showAllData} from './main.js'; // import the function

// Navbar ----------------------------------------------------------------->
const navbar = document.querySelector('nav');
const ham = document.getElementById('ham-icon');
const links = document.getElementById('nav-responsive');
const accountIcon = document.querySelector('.account-icon');
const dropdownMenu = document.getElementById('account-dropdownMenu');

// Navbar scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

// Ham-icon
ham.addEventListener('click', (event) => {
    event.preventDefault(); // stop href="#"
    responsiveHam();
});

function responsiveHam() {
    const x = document.getElementById('hamjs');
    if (links.className === 'links') {
        links.className += ' responsive';
    } else {
        links.className = 'links';
    }
}

// Toggle dropdown visibility
accountIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
    getUserProfile();
});

document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && !accountIcon.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

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

// API
async function getUserProfile() {
    try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
            method: "GET",
            credentials: "include", // Cookie (JWT)
        });
        const result = await response.json();
        if (result.success) {
            document.getElementById("user_name").innerText = result.user.user_name;
            const userEmail = document.getElementsByClassName("user_email");
            userEmail[0].innerText = result.user.email;
            userEmail[1].value = result.user.email;
        } else {
            alert("โหลดข้อมูลไม่สำเร็จ!");
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

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

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
    const suggestionsdiv = document.getElementById("suggestionsdiv");
    const suggestionsList = document.getElementById("suggestions");
    let selectedCity = "กรุงเทพมหานคร"; // Default

    // when load web will get weather data of default city
    await fetchWeatherData(selectedCity);

    // default data in search input
    searchInput.value = selectedCity;

    // Get weather data of city
    async function fetchWeatherData(city) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/weatherdataofcity?q=${encodeURIComponent(city)}`);
            const result = await response.json();
            console.log("ผลลัพธ์:", result);
            await showAllData(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
        }
    }

    // Search city
    searchInput.addEventListener("input", async function () {
        const query = this.value.trim();

        if (query.length === 0) {
            suggestionsList.innerHTML = "";
            suggestionsdiv.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/user/search?q=${query}`);
            const cities = await response.json();
            renderSuggestions(cities);
            suggestionsdiv.style.display = cities.length > 0 ? "block" : "none"; // Show or Hide suggestions
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            suggestionsdiv.style.display = "none";
        }
    });

    // Show suggestions
    function renderSuggestions(cities) {
        suggestionsList.innerHTML = "";
        cities.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city;
            li.addEventListener("click", () => {
                searchInput.value = city;
                selectedCity = city;
                suggestionsList.innerHTML = "";
                fetchWeatherData(selectedCity); // get weather data of selected city
                suggestionsdiv.style.display = "none";
            });
            suggestionsList.appendChild(li);
        });
        // ตรวจสอบจำนวน li ใน suggestionsList
        if (suggestionsList.children.length > 0) {
            suggestionsdiv.style.display = "block";
        } else {
            suggestionsdiv.style.display = "none";
        }
    }

    // When push enter button
    searchInput.addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
            selectedCity = searchInput.value.trim() || "กรุงเทพมหานคร"; // Default
            console.log("จังหวัดที่เลือก:", selectedCity);
            fetchWeatherData(selectedCity); // get weather data of selected city
            suggestionsdiv.style.display = "none";
        }
    });

    // Hide suggestions when click outside
    document.addEventListener("click", (event) => {
        if (!suggestionsdiv.contains(event.target) && event.target !== searchInput) {
            suggestionsdiv.style.display = "none";
        }
    });
});

getUserProfile();
// API
// Navbar ----------------------------------------------------------------->
