// Navbar ----------------------------------------------------------------->
const navbar = document.querySelector('nav');
const ham = document.getElementById('ham-icon');
const links = document.getElementById('nav-responsive');
const toggle = document.getElementById('toggle-icon');
const toggle_tem = document.getElementById('toggle-tem-icon');
const accountIcon = document.querySelector('.account-icon');
const dropdownMenu = document.getElementById('account-dropdownMenu');
let isDarkMode = false;
let isTemMode = false;

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

// Light - Dark Mode
toggle.addEventListener('click', swMode);

if (localStorage.getItem('theme') === 'dark') {
    isDarkMode = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    toggle.className = "fa-regular fa-sun";
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    toggle.className = "fa-regular fa-moon";
}

function swMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.className = "fa-regular fa-sun";
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        toggle.className = "fa-regular fa-moon";
        localStorage.setItem('theme', 'light');
    }
}

// Temperature Mode
toggle_tem.addEventListener('click', swtemMode);

function swtemMode() {
    isTemMode = !isTemMode;
    if (isTemMode) {
        toggle_tem.innerText = "°F";
    }
    else {
        toggle_tem.innerText = "°C";
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
            document.getElementById("user_email").innerText = result.user.email;
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

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const suggestionsList = document.getElementById("suggestions");
    const forecastDiv = document.getElementById("forecast");

    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            suggestionsList.innerHTML = "";
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/search?q=${query}`);
            const cities = await res.json();
            showSuggestions(cities);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    });

    function showSuggestions(cities) {
        suggestionsList.innerHTML = "";
        if (cities.length === 0) return;

        cities.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city.city_name;
            li.addEventListener("click", () => {
                searchInput.value = city.city_name;
                fetchForecast(city.city_name);
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(li);
        });
    }

    async function fetchForecast(city) {
        try {
            const res = await fetch(`/api/forecast?city=${city}`);
            const data = await res.json();

            if (data.message) {
                forecastDiv.innerHTML = `<p>${data.message}</p>`;
            } else {
                forecastDiv.innerHTML = `
                    <h3>Weather Forecast for ${data[0].city_name}</h3>
                    <p>Date: ${data[0].forecast_date}</p>
                    <p>Temperature: ${data[0].fore_temp}°C</p>
                    <p>Humidity: ${data[0].fore_humidity}%</p>
                    <p>Condition: ${data[0].description}</p>
                `;
            }
        } catch (err) {
            console.error("Error fetching forecast:", err);
        }
    }
});

// API
// Navbar ----------------------------------------------------------------->
