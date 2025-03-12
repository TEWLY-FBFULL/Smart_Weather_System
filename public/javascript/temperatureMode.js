// Convert °C to °F
function convertToFahrenheit(celsius) {
    return (celsius * (9/5)) + 32;
}

// Get temperature mode from localStorage (default: "C")
function getTemperatureMode() {
    return localStorage.getItem("temperature") || "C";
}

// Update all temperature displays
function updateTemperature(result) {
    const mode = getTemperatureMode();
    const temperatureEls = document.querySelectorAll(".tem-fromAPI"); // All elements with class "tem-fromAPI"
    const min_max_temp = document.querySelector(".min-max-tem-fromAPI"); 

    temperatureEls.forEach((el) => {
        const temp = mode === "F" 
            ? convertToFahrenheit(result.weather.rep_temp).toFixed(0) 
            : result.weather.rep_temp.toFixed(0);
        const unit = mode === "F" ? "°F" : "°C";

        el.textContent = `${temp}${unit}`;
    });

    if (min_max_temp) {
        if (mode === "F") {
            min_max_temp.textContent = `${convertToFahrenheit(result.weather.rep_temp_min
            ).toFixed(0)}°F - ${convertToFahrenheit(result.weather.rep_temp_max
            ).toFixed(0)}°F`;
        } else {
            min_max_temp.textContent = `${result.weather.rep_temp_min.toFixed(0)}°C - 
            ${result.weather.rep_temp_max.toFixed(0)}°C`;
        }
    }
    document.dispatchEvent(new Event("temperatureUpdated"));
}

// Update temperature display for popular cities
function updatePopularCitiesTemperature(result) {
    const mode = getTemperatureMode();
    const temperatureEls = document.querySelectorAll(".pop-tem-fromAPI");
    console.log("Total elements from popular city:", temperatureEls.length);

    temperatureEls.forEach((el) => {
        const cityId = parseInt(el.getAttribute("data-city-id"));
        const cityData = result.popularCity.find(city => city.city_id === cityId);

        if (cityData) {
            const temp = mode === "F"
                ? convertToFahrenheit(cityData.rep_temp).toFixed(0)
                : cityData.rep_temp.toFixed(0);
            const unit = mode === "F" ? "°F" : "°C";

            el.textContent = `${temp}${unit}`;
        } else {
            console.warn(`No data found for City ID: ${cityId}`);
        }
    });
    document.dispatchEvent(new Event("temperatureUpdated"));
}

// Set temperature mode toggle button
const toggleTemp = document.getElementById("toggle-tem-icon");

if (toggleTemp) {
    // Set initial mode
    toggleTemp.innerText = getTemperatureMode() === "F" ? "°F" : "°C";

    // Toggle temperature mode on click
    toggleTemp.addEventListener("click", () => {
        const newMode = getTemperatureMode() === "C" ? "F" : "C";

        // Save to localStorage
        localStorage.setItem("temperature", newMode);

        // Update UI
        toggleTemp.innerText = newMode === "C" ? "°C" : "°F";

        // Trigger event to update new temperature at UI
        document.dispatchEvent(new Event("temperatureModeChanged"));
    });
}

export { updateTemperature, getTemperatureMode, convertToFahrenheit, updatePopularCitiesTemperature };
