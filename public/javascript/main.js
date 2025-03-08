import { createWeatherCard } from "./createWeatherCards.js";
import { getWeatherIcon } from "./getWeatherIcon.js";
import { formatDate } from "./formatDate.js";
import { updateSlidesPerView } from "./containerSwiper.js";
import { createCityMap } from "./cityMap.js";
import { updateTemperature, getTemperatureMode, convertToFahrenheit } from "./temperatureMode.js"; 

async function showAllData(result) {
    window.latestResult = result;

    // Temperature class
    updateTemperature(result);

    // City name class
    const cityname = document.getElementsByClassName("city-name-fromAPI");
    cityname[0].innerText = result.city.city_name.trim();
    cityname[1].innerHTML = `<i class="fas fa-map-marker-alt fa-2x"></i> ${result.city.city_name.trim()}`;

    // Date and Time ID
    const dateOptions = { weekday: "long", day: "numeric", month: "long" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const dateID = document.getElementById("data-th");
    const currentTimeID = document.getElementById("current-time-th");
    const dateShow = new Date().toLocaleDateString("th-TH", dateOptions);
    const currentTimeShow = `อัปเดตเมื่อ ${new Date().toLocaleTimeString("th-TH", timeOptions)} น.`;
    dateID.innerHTML = dateShow;
    currentTimeID.innerHTML = currentTimeShow;

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

    // Culculate temperature for map
    const tempMode = getTemperatureMode();
    const tempForMap = tempMode === "F" ? convertToFahrenheit(result.weather.rep_temp).toFixed(0) : result.weather.rep_temp.toFixed(0);

    // Create City Map
    await createCityMap(result.city.city_name, result.city.lat, result.city.lon, 
        result.weather.weather_desc_th, tempForMap, result.weather.rep_humidity);

    // Forecast Today and 5 days
    // Forecast Today
    const showWeatherForecastSlide = document.getElementsByClassName("swiper-wrapper");
    const today = new Date().toISOString().split("T")[0]; // Today
    const todayForecast = result.forecast.filter(item => item.local_date === today);
    todayForecast.sort((a, b) => a.forecast_time.localeCompare(b.forecast_time)); // 06:00 → 21:00

    // Forecast 5 days
    const next5DaysForecast = result.forecast
    .filter(item => item.local_date > today && item.forecast_time === "06:00:00")
    .sort((a, b) => a.local_date.localeCompare(b.local_date));

    // Clear the old slides
    showWeatherForecastSlide[0].innerHTML = ""; // Forecast Today
    showWeatherForecastSlide[1].innerHTML = ""; // Forecast 5 Days

    // Update Slides of Swiper
    console.log("Today Forecast:", todayForecast.length);
    console.log("Next 5 Days Forecast:", next5DaysForecast.length);
    await updateSlidesPerView(0, todayForecast.length);
    await updateSlidesPerView(1, next5DaysForecast.length);

    // Create new slides
    todayForecast.forEach(item => {
        showWeatherForecastSlide[0].innerHTML += createWeatherCard(
            item.forecast_time.slice(0, 5), // 06:00:00 → 06:00 
            item.fore_temp,      
            item.fore_humidity,  
            (item.fore_wind_speed).toFixed(0), 
            item.weather_desc_th,
            getWeatherIcon(item.weather_desc_th) 
        );
    });
    
    next5DaysForecast.forEach(item => {
        showWeatherForecastSlide[1].innerHTML += createWeatherCard(
            formatDate(item.local_date), // 2021-01-01 → 1 มกราคม   
            item.fore_temp,     
            item.fore_humidity,  
            (item.fore_wind_speed).toFixed(0), 
            item.weather_desc_th, 
            getWeatherIcon(item.weather_desc_th) 
        );
    });
    // Update temperature when the temperature mode is changed
    document.addEventListener("temperatureModeChanged", () => {
        // **เพิ่มการอัปเดตข้อมูลแสดงผลทั้งหมด**
        showAllData(window.latestResult);
    });
}

export { showAllData }; // export the function