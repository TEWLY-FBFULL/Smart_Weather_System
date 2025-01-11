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
});

document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && !accountIcon.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    alert('You have logged out.');
    // Add your logout logic here
});
// Navbar ----------------------------------------------------------------->
