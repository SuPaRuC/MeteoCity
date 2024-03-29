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
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
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

    myMap.on('click', async (ev) => {
      pos.setLatLng(ev.latlng);
      this.lat = ev.latlng.lat;
      this.lon = ev.latlng.lng;
      getCityByLocation(ev.latlng.lat, ev.latlng.lng, false);
    });
  } catch (err) {
    console.log(err);
  }
}

// Function that search forecast based on location
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
async function getCityByLocation (lat, lon, check) {
  if (lat !== null && lon !== null) {
    const weatherResponse = await validator(`/api/v1/getPositionalWeather/${lat}/${lon}`);
    const radarButton = document.getElementById('satellite-rain-map');
    lat = weatherResponse.coord.lat;
    lon = weatherResponse.coord.lon;

    if ((lat < 36.51 || lat > 47.21) || (lon < 6.65 || lon > 18.54)) {
      radarButton.classList.add('hidden');
    } else {
      radarButton.classList.remove('hidden');
    }

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

    // Create a visual map if not already created
    if (check) {
      let myMap = L.map('map').setView([lat, lon], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        // Attribution is obligatory as per copyright!
        maxZoom: 20
      }).addTo(myMap);

      // Show the marker in the correct position
      let pos = L.marker([lat, lon]).addTo(myMap);
      pos.bindPopup('Sei qui!');

      myMap.on('click', async (ev) => {
        pos.setLatLng(ev.latlng);
        this.lat = ev.latlng.lat;
        this.lon = ev.latlng.lng;
        getCityByLocation(ev.latlng.lat, ev.latlng.lng, false);
      });
    }
  } else {
    document.getElementById('pos').innerText = 'Permessi di geolocalizzazione non concessi.';
  }
}

// Function that handles favourites cities for a specific user
// and make calls to get & update the list of favourites.
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
async function handleFavourites (mode) {
  const email = sessionStorage.getItem('email');
  const xhttp = new XMLHttpRequest();
  const addButton = document.getElementById('button-favs-add');
  const removeButton = document.getElementById('button-favs-remove');

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

    // AJAX call to update favourites array and buttons
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        removeButton.classList.add('hidden');
        addButton.classList.remove('hidden');
      }
    };

    xhttp.open("POST", "/api/v1/users/update-favourite");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email: email, cityName: '', favourites: favourites }));
  }

  // SECTION - ADD - If we have to add
  if (mode === 'add') {
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        removeButton.classList.remove('hidden');
        addButton.classList.add('hidden');
      }
    };

    // AJAX call to update favourites array and buttons
    xhttp.open("POST", "/api/v1/users/update-favourite");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ email: email, cityName: cityName.toLowerCase(), favourites: favourites }));
  }
}

// Function that handles buttons for adding/removing favourites cities
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
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
    const addButton = document.getElementById('button-favs-add');
    const removeButton = document.getElementById('button-favs-remove');

    // Show the correct buttons each page
    if (favourites.includes(cityName.toLowerCase())) {
      removeButton.classList.remove('hidden');
      addButton.classList.add('hidden');
    } else {
      addButton.classList.remove('hidden');
      removeButton.classList.add('hidden');
    }
  }
}

// Functions that loads radar animation for rain forecast
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
async function showRainMap () {
  if (this.lat !== undefined && this.lon !== undefined) {
    const latitude = this.lat;
    const longitude = this.lon;

    // Check latitude
    if (latitude > 44.11 && latitude < 46.9) {
            
      // Check longitude
      if (longitude > 6.64 && longitude < 11.54) {
        // Loads north-west radar map
        window.open('https://cdn4.3bmeteo.com/images/radar/SWI_animation.gif', '_blank');
      } else {
        // Loads Italy radar map
        window.open('https://cdn4.3bmeteo.com/images/radar/VMI_animation.gif', '_blank');
      }
    } else {
      // Loads Italy radar map
      window.open('https://cdn4.3bmeteo.com/images/radar/VMI_animation.gif', '_blank');
    }
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Check latitude
      if (latitude > 44.11 && latitude < 46.9) {
              
        // Check longitude
        if (longitude > 6.64 && longitude < 11.54) {
          // Loads north-west radar map
          window.open('https://cdn4.3bmeteo.com/images/radar/SWI_animation.gif', '_blank');
        } else {
          // Loads Italy radar map
          window.open('https://cdn4.3bmeteo.com/images/radar/VMI_animation.gif', '_blank');
        }
      } else {
        // Loads Italy radar map
        window.open('https://cdn4.3bmeteo.com/images/radar/VMI_animation.gif', '_blank');
      }
    });
  }
}

// Load the info whenever the page loads
// @author LucaParenti <luca.parenti1@studenti.unimi.it>
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get("cityName");
  
  // Get information about forecast
  if (city !== null) {
    searchCityForecast(city);
  } else {
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          getCityByLocation(latitude, longitude, true);
        });
      } else {
        getCityByLocation(null, null, true);
      }
    });
  }
});