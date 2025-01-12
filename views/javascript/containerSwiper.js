// Container swiper ----------------------------------------------------------------->
const todayBtn = document.getElementById("today-btn");
const fiveDaysBtn = document.getElementById("five-days-btn");
const todayForecast = document.getElementById("today-forecast");
const fiveDaysForecast = document.getElementById("five-days-forecast");

// Forecast Today and Five Days
todayBtn.addEventListener("click", () => {
    todayForecast.classList.add("active");
    fiveDaysForecast.classList.remove("active");
    todayBtn.classList.add("active");
    fiveDaysBtn.classList.remove("active");
});

fiveDaysBtn.addEventListener("click", () => {
    fiveDaysForecast.classList.add("active");
    todayForecast.classList.remove("active");
    fiveDaysBtn.classList.add("active");
    todayBtn.classList.remove("active");
});

// Swiper Cards (Today Forecast)
let swiperCards = new Swiper(".today-swiper", {
    loop: true,
    spaceBetween: 32,
    grabCursor: true,
    pagination: {
        el: ".today-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: ".today-next",
        prevEl: ".today-prev",
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

// Swiper 5 Days Forecast
let fiveDaysSwiper = new Swiper(".five-days-swiper", {
    loop: false,
    spaceBetween: 32,
    grabCursor: true,
    pagination: {
        el: ".five-days-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: ".five-days-next", 
        prevEl: ".five-days-prev",
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

// Resize swiper when window resize
window.addEventListener('resize', () => {
    swiperCards.update();
    fiveDaysSwiper.update();
});
// Container swiper ----------------------------------------------------------------->