// All requires
const express = require('express');
const axios = require("axios");
const path = require('path');
require('dotenv/config');

// Tell the app to use express to render the pages
const app = express();

// Tell express to look for the static views in public folder
app.use(express.static(path.join(__dirname, 'public')));

// Tell express to look for the static css files in styles folder
app.use(express.static(path.join(__dirname, 'styles')));

// Tell express to look for the static files in js folder
app.use(express.static(path.join(__dirname, 'js')));

// SECTION - Routes
app.get('/', (req, res) => {
  res.render('index.html');
});

// SECTION - APIs
app.get('/api/v1/getCityWeather/:city', (req, res) => {
  const city = req.params.city;

  axios.get(`${process.env.WEATHER_API_LINK}?q=${city}&appid=${process.env.WEATHER_API_KEY}&lang=it`)
    .then((cityData) => axios.get(`${process.env.WEATHER_API_LINK}?lat=${cityData.data.coord.lat}&lon=${cityData.data.coord.lon}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=it`))
    .then((weather) => res.send(weather.data))
    .catch((err) => res.json({error: `Città non trovata, Info: ${err}`}));
});

app.get('/api/v1/getPositionalWeather/:lat/:lon', (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;

  axios.get(`${process.env.WEATHER_API_LINK}?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=it`)
    .then((weather) => res.send(weather.data))
    .catch((err) => res.json({error: `Città non trovata, Info: ${err}`}));
});

// Start listenting to port 3000
app.listen(3000);