import { getWeatherIcon } from "./getWeatherIcon.js";
import { updateWeatherSlides } from "./containerSwiper.js";
import { createCityMap } from "./cityMap.js";
import { updateTemperature, getTemperatureMode, convertToFahrenheit, updatePopularCitiesTemperature } from "./temperatureMode.js"; 
import { createGraph } from "./temperatureGraph.js";
import { initXPosts } from "./createXpostsCards.js";
import { createYoutubeVideosCard } from "./createYoutubeCards.js";

async function showAllData(result) {
    // Check if the result is valid
    if (!result || !result.city || !result.weather || !result.popularCity 
        || !result.forecast || !result.xPosts || !result.youtubeVideos) {
        console.error("Invalid result data:", result);
        return;
    }
    window.latestResult = result;

    // Temperature class
    updateTemperature(result);
    updatePopularCitiesTemperature(result);

    // City name class
    const cityname = document.getElementsByClassName("city-name-fromAPI");
    if (cityname.length > 0) cityname[0].textContent = result?.city?.city_name?.trim() || "Unknown";
    if (cityname.length > 1) cityname[1].innerHTML = `<i class="fas fa-map-marker-alt fa-2x"></i> ${result?.city?.city_name?.trim() || "Unknown"}`;
    if (cityname.length > 2) cityname[2].textContent = result?.city?.city_name?.trim() || "Unknown";

    // Date and Time ID
    const dateOptions = { weekday: "long", day: "numeric", month: "long" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const dateID = document.getElementById("data-th");
    const currentTimeID = document.getElementById("current-time-th");
    const dateShow = new Date().toLocaleDateString("th-TH", dateOptions);
    const currentTimeShow = `อัปเดตเมื่อ ${new Date().toLocaleTimeString("th-TH", timeOptions)} น.`;
    dateID.textContent = dateShow;
    currentTimeID.textContent = currentTimeShow;

    // Humidity class
    const humidity = document.getElementsByClassName("hum-fromAPI");
    humidity[0].innerHTML = `<i class="fas fa-tint fa-2x"></i> ความชื้น ${result.weather.rep_humidity}%`;

    // Wind speed class
    const wind = document.getElementsByClassName("wind-fromAPI");
    wind[0].innerHTML = `<i class="fas fa-wind fa-2x"></i> ลม ${result.weather.rep_wind_speed} km/h`;

    // Description class
    const description = document.getElementsByClassName("desc-fromAPI");
    description[0].innerHTML = `<i class="fas fa-sun fa-2x"></i> ${result.weather.weather_desc_th}`;

    // Link Google map with lon-lat
    const linkMapWithLonLat = document.querySelector(".lon-lat-fromAPI");
    linkMapWithLonLat.href = `https://www.google.com/maps?q=${result.city.lat},${result.city.lon}`;

    // Weather icon class
    const weatherIcon = document.getElementsByClassName("weather-icon-fromAPI");
    weatherIcon[0].src = getWeatherIcon(result.weather.weather_desc_th);
    for (let i = 1; i <= 6; i++) { 
        weatherIcon[i].src = getWeatherIcon(result.popularCity[i - 1].weather_desc_th);
    }
    weatherIcon[7].src = getWeatherIcon(result.weather.weather_desc_th);
    
    // Culculate temperature for map
    const tempMode = getTemperatureMode();
    const tempForMap = tempMode === "F" ? convertToFahrenheit(result.weather.rep_temp).toFixed(0) : result.weather.rep_temp.toFixed(0);

    // Create City Map
    await createCityMap(result.city.city_name, result.city.lat, result.city.lon, 
        result.weather.weather_desc_th, tempForMap, result.weather.rep_humidity);

    // Forecast Today
    const today = new Date().toISOString().split("T")[0]; // Today
    const todayForecast = result.forecast.filter(item => item.local_date === today);
    todayForecast.sort((a, b) => a.forecast_time.localeCompare(b.forecast_time)); // 06:00 → 21:00

    // Forecast 5 days
    const next5DaysForecast = result.forecast
    .filter(item => item.local_date > today && item.forecast_time === "06:00:00")
    .sort((a, b) => a.local_date.localeCompare(b.local_date));

    // Create Weather Cards
    updateWeatherSlides(todayForecast, next5DaysForecast);
    // Create Wather Graph
    await createGraph(todayForecast);
    // Create Xposts Cards
    const xpostcontainer = document.querySelector(".x-post-articles");
    if (xpostcontainer && xpostcontainer.children.length > 0) {
        console.log("ข้ามการสร้าง XPosts (มีอยู่แล้ว)");
    } else {
        await initXPosts(result.xPosts);
    }
    // Create Youtube Cards
    await createYoutubeVideosCard(result.youtubeVideos);

    // Update temperature when the temperature mode is changed
    document.addEventListener("temperatureModeChanged", temperatureChangeHandler, { once: true });

    function temperatureChangeHandler() {
        showAllData(window.latestResult);
    }
}

export { showAllData }; // export the function