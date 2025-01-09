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

// Container swiper ----------------------------------------------------------------->
let swiperCards = new Swiper(".card__content", {
    loop: true,
    spaceBetween: 32,
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        600: {
            slidesPerView: 2,
        },
        968: {
            slidesPerView: 3,
        },
    },
    observer: true,
    observeParents: true,
});
// Container swiper ----------------------------------------------------------------->

// City swiper ------------------------------------------------------------------------>
let citySwiper = new Swiper('.city-swiper', {
    slidesPerView: 1,            
    slidesPerGroup: 1,        
    spaceBetween: 6,          
    loop: true,                 
    autoplay: {
        delay: 3000,            
        disableOnInteraction: false,
    },
    breakpoints: {
        480: {
            slidesPerView: 2,
            spaceBetween: 6,
        },
        720: {
            slidesPerView: 3,
            spaceBetween: 12,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
    },
    navigation: false,
    observer: true,
    observeParents: true,
});
// City swiper ------------------------------------------------------------------------>

// Resize swiper when window resize
window.addEventListener('resize', () => {
    swiperCards.update(); 
    citySwiper.update();
});

// Animation ------------------------------------------------------------------------>
// ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Select all class "revealUp"
gsap.utils.toArray(".revealUp").forEach((elem) => {
  ScrollTrigger.create({
    trigger: elem, 
    start: "top 90%",
    end: "bottom 20%", 
    once: true,
    onEnter: () => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 100 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 }
      );
    }
  });
});

// ScrollTrigger plugin
// Animation ----------------------------------------------------------------------->
