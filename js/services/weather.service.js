export const weatherService = {
  getWeatherByLocation
};


function getWeatherByLocation(location, onSuccess) {
  const API_WEATHER_KEY = '83c7a3c9dfa5c1fb2ef752bc8648d37b';
  axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&APPID=${API_WEATHER_KEY}&units=metric`)
    .then(res => {
      const data = res.data;
      const weatherData = {
        temp: data.main.temp.toFixed(0),
        feels_like: data.main.feels_like.toFixed(0),
        temp_min: data.main.temp_min.toFixed(0),
        temp_max: data.main.temp_max.toFixed(0),
        humidity: data.main.humidity.toFixed(0),
        weather: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      }
      onSuccess(weatherData);
    })
    .catch(err => {
      console.log('Error fetching weather data: ' + err);
    })
}