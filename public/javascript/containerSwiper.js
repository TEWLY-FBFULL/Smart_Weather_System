import { getWeatherIcon } from "./getWeatherIcon.js";
import { createWeatherCard } from "./createWeatherCards.js";
import { formatDate } from "./formatDate.js";

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

// Resize swiper when window load
window.addEventListener("load", () => {
    swiperCards.update();
    fiveDaysSwiper.update();
});

// Update Weather Slides
const updateWeatherSlides = (todayForecast, next5DaysForecast) => {
    // Create fragment
    const todayFragment = document.createDocumentFragment();
    const fiveDaysFragment = document.createDocumentFragment();

    // Insert data to Today Swiper
    todayForecast.forEach(item => {
        const card = createWeatherCard(
            item.forecast_time.slice(0, 5),
            item.fore_temp,      
            item.fore_humidity,  
            (item.fore_wind_speed ? item.fore_wind_speed.toFixed(0) : "0"), 
            item.weather_desc_th,
            getWeatherIcon(item.weather_desc_th) 
        );
        if (card instanceof Node) todayFragment.appendChild(card);
    });

    // Insert data to 5 Days Swiper
    next5DaysForecast.forEach(item => {
        const card = createWeatherCard(
            formatDate(item.local_date),
            item.fore_temp,     
            item.fore_humidity,  
            (item.fore_wind_speed ? item.fore_wind_speed.toFixed(0) : "0"), 
            item.weather_desc_th, 
            getWeatherIcon(item.weather_desc_th) 
        );
        if (card instanceof Node) fiveDaysFragment.appendChild(card);
    });

    console.log("Today Slides:", todayFragment.children.length);
    console.log("Five Days Slides:", fiveDaysFragment.children.length);

    // Clear old slides 
    swiperCards.removeAllSlides();
    fiveDaysSwiper.removeAllSlides();

    // Add new slides
    swiperCards.appendSlide([...todayFragment.children]);
    fiveDaysSwiper.appendSlide([...fiveDaysFragment.children]);

    // Update Swiper
    swiperCards.update();
    fiveDaysSwiper.update();
};

document.addEventListener("DOMContentLoaded", () => {
    swiperCards.update();
    fiveDaysSwiper.update();
});


export { updateWeatherSlides };
// Container swiper ----------------------------------------------------------------->