const { getLatestWeatherReportWithCityID } = require('../models/weatherModel');

// Get data for popular cities
const getPopularCities = async () => {
    const majorCities = [1, 38, 66, 70, 29, 64];
    const popularCity = await Promise.all(
        majorCities.map(city_id => getLatestWeatherReportWithCityID(city_id)));
    console.log("popularCity:", popularCity);
    return popularCity;
};

module.exports = getPopularCities;