// Function that validates and fetch the url passed
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
async function validator (url) {
  const response = await fetch(url);
  return response.ok ? response.json() : Promise.reject({ error: 500 });
};

// Function that calls APIs and get specific city info
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
async function getCityWeatherInfo (city) {
  try {
    const cityWithoutUppercase = city.toLowerCase();
    const weatherResponse = await validator(`/api/v1/getCityWeather/${city}`);
    document.getElementById(`temp-${cityWithoutUppercase}`).innerText = 'Temperatura: ' + weatherResponse.main.temp + ' °C'
  } catch (err) {
    console.log(err);
  }
}

// Function that calls APIs and get user based location forecast
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
async function getUserWeatherInfo (lat, lon) {
  const weatherResponse = await validator(`/api/v1/getPositionalWeather/${lat}/${lon}`);
  document.getElementById('user-position').innerText = 'Posizione rilevata: ' + weatherResponse.name;
  document.getElementById('user-temp').innerText = 'Temperatura: ' + weatherResponse.main.temp + '°C';
}

// Made the entire weather load whenever a user get in the homepage
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
document.addEventListener('DOMContentLoaded', () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getUserWeatherInfo(latitude, longitude);
  });

  getCityWeatherInfo("Milano");
  getCityWeatherInfo("Sidney");
  getCityWeatherInfo("Berlino");
});