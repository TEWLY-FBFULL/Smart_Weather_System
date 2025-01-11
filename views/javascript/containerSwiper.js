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

// Resize swiper when window resize
window.addEventListener('resize', () => {
    swiperCards.update(); 
});
// Container swiper ----------------------------------------------------------------->