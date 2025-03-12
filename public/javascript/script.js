const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

// Show mobile menu
hamburgerBtn.addEventListener("click", () => {
    navbarMenu.classList.toggle("show-menu");
});

// Hide mobile menu
hideMenuBtn.addEventListener("click", () =>  hamburgerBtn.click());

// Show login popup
showPopupBtn.addEventListener("click", () => {
    document.body.classList.toggle("show-popup");
});

// Hide login popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

// Show or hide signup form
signupLoginLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
    });
});

// All Effect
const backgrounds = [
    { image: "/img/hero-bg.jpg", effect: "snow" },
    { image: "/img/sea.jpg", effect: "none" },
    { image: "/img/forest.jpg", effect: "firefly" },
];

let currentIndex = 0;
const effectContainer = document.getElementById("effect-container");

function changeBackground() {
    const { image, effect } = backgrounds[currentIndex];
    
    // Change background image
    document.body.style.background = `url("${image}") center/cover no-repeat`;

    // Clear previous effect
    effectContainer.innerHTML = "";

    // Add new effect
    if (effect === "snow") {
        createSnowEffect();
    } else if (effect === "firefly") {
        createFireflyEffect();
    }

    // Next background
    currentIndex = (currentIndex + 1) % backgrounds.length;
}

// Snow Effect
function createSnowEffect() {
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
        snowflake.style.left = Math.random() * 100 + "vw";
        snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
        effectContainer.appendChild(snowflake);
    }
}

// Firefly Effect
function createFireflyEffect() {
    for (let i = 0; i < 20; i++) {
        const firefly = document.createElement("div");
        firefly.classList.add("firefly");
        firefly.style.left = Math.random() * 100 + "vw";
        firefly.style.top = Math.random() * 100 + "vh";
        firefly.style.animationDuration = Math.random() * 3 + 2 + "s";
        effectContainer.appendChild(firefly);
    }
}

setInterval(changeBackground, 6000);
