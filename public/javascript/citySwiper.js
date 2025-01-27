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

// Resize swiper when window resize
window.addEventListener('resize', () => {
    citySwiper.update();
});
// City swiper ------------------------------------------------------------------------>