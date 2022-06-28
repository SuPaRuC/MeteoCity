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

  // Save the city to localstorage
  const city = {
    cityName: weatherResponse.name,
    date: new Date().getTime()
  };

  localStorage.setItem('City', JSON.stringify(city));
}

// Function that loads details of the city directly from the homepage
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
function loadDetails () {
  var city = localStorage.getItem('City');
  city = JSON.parse(city);
  const cityName = city.cityName;
  window.location.href = '/cities?cityName=' + cityName;
}

// Made the entire weather load whenever a user get in the homepage
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
document.addEventListener('DOMContentLoaded', () => {
  // Clear localstorage after some time
  var city = localStorage.getItem('City');
  city = JSON.parse(city);
  var date = city.date;
  var today = new Date().getTime();

  if (today - date > (1000 * 86400)) {
    localStorage.clear()
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getUserWeatherInfo(latitude, longitude);
  });

  getCityWeatherInfo("Milano");
  getCityWeatherInfo("Sidney");
  getCityWeatherInfo("Berlino");
});