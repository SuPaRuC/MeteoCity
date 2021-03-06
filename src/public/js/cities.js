var lat;
var lon;
var cityName;

// Function that validates and fetch the URL
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
async function validator (url) {
  const response = await fetch(url);
  return response.ok ? response.json() : Promise.reject({ error: 500 });
};

// Function search forecast for a specific city
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
async function searchCityForecast (city) {
  try {
    const weatherResponse = await validator(`/api/v1/getCityWeather/${city}`);
    
    if (weatherResponse.name === undefined) {
      document.getElementById('pos').innerText = 'Posizione: Sconosciuta';
    } else {
      document.getElementById('pos').innerText = 'Posizione: ' + city;
      cityName = city;
      handleButtons(cityName);
      
      // Calculate lat and lon
      lat = weatherResponse.coord.lat;
      lon = weatherResponse.coord.lon;

      // Show all details to the view
      document.getElementById('temp').innerText = 'Temperatura: ' + weatherResponse.main.temp + ' °C';
      document.getElementById('temp-maxmin').innerText = 
        'Temperatura (massima e minima): ' + weatherResponse.main.temp_max + ' - ' + weatherResponse.main.temp_min + ' °C';
      document.getElementById('temp-perc').innerText = 'Temperatura percepita: ' + weatherResponse.main.feels_like + ' °C';
      document.getElementById('hum').innerText = 'Umidità: ' + weatherResponse.main.humidity;
      document.getElementById('descr').innerText = 'Descrizione: ' + weatherResponse.weather[0].description;
      document.getElementById('wind').innerText = 'Vento: ' + weatherResponse.wind.speed + ' Km/H';
    }

    // Create a visual map
    let myMap = L.map('map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      // Attribution is obligatory as per copyright!
      maxZoom: 20
    }).addTo(myMap);

    // Show the marker in the correct position
    let pos = L.marker([lat, lon]).addTo(myMap);
    pos.bindPopup('Sei qui!');
  } catch (err) {
    console.log(err);
  }
}

// Function that search forecast based on location
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
async function getCityByLocation (lat, lon) {
  const weatherResponse = await validator(`/api/v1/getPositionalWeather/${lat}/${lon}`);
  lat = weatherResponse.coord.lat;
  lon = weatherResponse.coord.lon;

  if (weatherResponse.name === undefined) {
    document.getElementById('pos').innerText = 'Posizione: Sconosciuta';
  } else {
    document.getElementById('pos').innerText = 'Posizione: ' + weatherResponse.name;
    cityName = weatherResponse.name;
    handleButtons(cityName);
  }

  document.getElementById('pos').innerText = 'Posizione: ' + weatherResponse.name;
  document.getElementById('temp').innerText = 'Temperatura: ' + weatherResponse.main.temp + ' °C';
  document.getElementById('temp-maxmin').innerText = 
    'Temperatura (massima e minima): ' + weatherResponse.main.temp_max + ' - ' + weatherResponse.main.temp_min + ' °C';
  document.getElementById('temp-perc').innerText = 'Temperatura percepita: ' + weatherResponse.main.feels_like + ' °C';
  document.getElementById('hum').innerText = 'Umidità: ' + weatherResponse.main.humidity;
  document.getElementById('descr').innerText = 'Descrizione: ' + weatherResponse.weather[0].description;
  document.getElementById('wind').innerText = 'Vento: ' + weatherResponse.wind.speed + ' Km/H';

  // Create a visual map
  let myMap = L.map('map').setView([lat, lon], 10);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    // Attribution is obligatory as per copyright!
    maxZoom: 20
  }).addTo(myMap);

  // Show the marker in the correct position
  let pos = L.marker([lat, lon]).addTo(myMap);
  pos.bindPopup('Sei qui!');
}

async function handleFavourites (mode) {
  const email = sessionStorage.getItem('email');

  // Call to get the favourites we already have
  const getFavs = await fetch("/api/v1/users/get-favourites", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        email: email
      }
    )
  });

  var favourites = await getFavs.json();

  // SECTION - REMOVE - If we have to remove
  if (mode === 'remove') {
    const i = favourites.indexOf(cityName.toLowerCase());

    // If index is found remove the item in that position
    if (i > -1) {
      favourites.splice(i, 1);
    }

    // Call to update favourites array
    const removeFavs = await fetch("/api/v1/users/update-favourite", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          email: email,
          cityName: '',
          favourites: favourites
        }
      )
    });

    const updateFavourites = await removeFavs.json();
    
    if (updateFavourites.status === 200) {
      window.location.href = '/cities?cityName=' + cityName;
    }
  }

  // SECTION - ADD - If we have to add
  if (mode === 'add') {
    // Call to update favourites array
    const addFavs = await fetch("/api/v1/users/update-favourite", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          email: email,
          cityName: cityName.toLowerCase(),
          favourites: favourites
        }
      )
    });

    const updateFavourites = await addFavs.json();
    
    if (updateFavourites.status === 200) {
      window.location.href = '/cities?cityName=' + cityName;
    }
  }
}

async function handleButtons (cityName) {
  const isLogged = sessionStorage.getItem('logged');
  // Load favourites from APIs if we're logged in and show correct buttons
  if (isLogged) {
    const email = sessionStorage.getItem('email');
    
    const favs = await fetch("/api/v1/users/get-favourites", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          email: email
        }
      )
    });

    const favourites = await favs.json();
    const add = document.getElementById('button-favs-add');
    const remove = document.getElementById('button-favs-remove');

    // Show the correct buttons each page
    if (favourites.includes(cityName.toLowerCase())) {
      remove.classList.remove('hidden');
    } else {
      add.classList.remove('hidden');
    }
  }
}

// Load the info whenever the page loads
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get("cityName");
  
  // Get information about forecast
  if (city !== null) {
    searchCityForecast(city);
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getCityByLocation(latitude, longitude);
    });
  }
});