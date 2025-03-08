const toggle = document.getElementById('toggle-icon');
let isDarkMode = false;

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