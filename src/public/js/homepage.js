// Function that validates and fetch the url passed
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
async function validator (url) {
  const response = await fetch(url);
  return response.ok ? response.json() : Promise.reject({ error: 500 });
};

// Function that calls APIs and get specific city info
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
async function getCityWeatherInfo (city) {
  try {
    const cityWithoutUppercase = city.toLowerCase();
    const weatherResponse = await validator(`/api/v1/getCityWeather/${city}`);
    document.getElementById(`temp-${cityWithoutUppercase}`).innerText = 'Temperatura: ' + weatherResponse.main.temp + ' °C';
  } catch (err) {
    console.log(err);
  }
}

// Function that calls APIs and get user based location forecast
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
async function getUserWeatherInfo (lat, lon) {
  if (lat !== null && lon !== null) {
    const weatherResponse = await validator(`/api/v1/getPositionalWeather/${lat}/${lon}`);
    document.getElementById('user-position').innerText = 'Posizione rilevata: ' + weatherResponse.name;
    document.getElementById('user-temp').innerText = 'Temperatura: ' + weatherResponse.main.temp + '°C';

    // Save the city to localstorage
    const city = {
      cityName: weatherResponse.name,
      date: new Date().getTime()
    };

    localStorage.setItem('City', JSON.stringify(city));
  } else {
    document.getElementById('user-position').innerText = 'Posizione rilevata: Nessuno (devi consentire la geolocalizzazione)';
    document.getElementById('user-temp').innerText = 'Temperatura: Nessuno';
  }
}

// Function that loads details of the city directly from the homepage
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
function loadDetails () {
  var city = localStorage.getItem('City');
  city = JSON.parse(city);
  const cityName = city.cityName;
  window.location.href = '/cities?cityName=' + cityName;
}

// Function that asks the user for geolocation permissions
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
function geoPermission () {
  if (confirm('Consenti geolocalizzazione, altrimenti il sito non funzionerà a dovere!')) {
    document.getElementById('geobutton').classList.add('hidden');
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getUserWeatherInfo(latitude, longitude);
    });
  } else {
    document.getElementById('geobutton').classList.remove('hidden');
    getUserWeatherInfo(null, null);
  }
}

// Made the entire weather load whenever a user get in the homepage
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
document.addEventListener('DOMContentLoaded', () => {
  navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
    if (result.state === 'granted') {
      document.getElementById('geobutton').classList.add('hidden');
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getUserWeatherInfo(latitude, longitude);
      });
    } else {
      document.getElementById('geobutton').classList.remove('hidden');
      if (confirm('Consenti geolocalizzazione, altrimenti il sito non funzionerà a dovere!')) {
        document.getElementById('geobutton').classList.add('hidden');
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          getUserWeatherInfo(latitude, longitude);
        });
      } else {
        document.getElementById('geobutton').classList.remove('hidden');
        getUserWeatherInfo(null, null);
      }
    }
  });

  getCityWeatherInfo("Milano");
  getCityWeatherInfo("Sidney");
  getCityWeatherInfo("Berlino");
});