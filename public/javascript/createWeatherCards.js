import { getTemperatureMode, convertToFahrenheit } from "./temperatureMode.js";

function createWeatherCard(time, tempCelsius, humidity, wind, desc, imgSrc) {
    const mode = getTemperatureMode();
    const temp = mode === "F" ? convertToFahrenheit(tempCelsius).toFixed(0) : tempCelsius.toFixed(0);
    const unit = mode === "F" ? "°F" : "°C";

    // Created template element
    const template = document.createElement("template");
    template.innerHTML = `
        <article class="card__article swiper-slide">
            <div class="card__image">
                <img src=${imgSrc} alt="weather" class="card__img">
                <div class="card__shadow"></div>
            </div>
            <div class="card__data">
                <h3 class="card__name">${time}</h3>
                <div class="card__description">
                    <div class="info">
                        <i class="fas fa-thermometer-half fa-1x"></i>
                        <span>${temp}${unit}</span>
                    </div>
                    <div class="info">
                        <i class="fas fa-tint fa-1x"></i>
                        <span>${humidity}%</span>
                    </div>
                    <div class="info">
                        <i class="fas fa-wind fa-1x"></i>
                        <span>${wind} km/h</span>
                    </div>
                    <div class="info">
                        <i class="fas fa-sun fa-1x"></i>
                        <span>${desc}</span>
                    </div>
                </div>
            </div>
        </article>
    `.trim();
    // Return Node
    return template.content.firstElementChild;
}

export { createWeatherCard }; // export the function