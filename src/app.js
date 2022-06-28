// All requires
const User = require('./public/js/models/User');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const axios = require("axios");
const path = require('path');
require('dotenv/config');

// Tell the app to use express
const app = express();

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  // secure: true require HTTPS wich we don't have since we're on localhost, maxAge in milliseconds
  cookie: {secure: false, maxAge: 3600000} 
}));

// Tell app to use cookie parser
app.use(cookieParser());

// Every time we get a request we make sure that's correctly interpretated
app.use(bodyParser.json());

// Tell express to look for the static views in public folder & what engine to use
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

// Tell express to look for the static css files in styles folder
app.use(express.static(path.join(__dirname, 'public')));

// SECTION - Routes
app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/cities', (req, res) => {
  res.render('cities.html');
});

app.get('/register', (req, res) => {
  res.render('register.html');
});

app.get('/users', (req, res) => {
  console.log(req.body);
});

// SECTION - DB connection
mongoose.connect(
  process.env.MONGODB_CONN, 
  { useNewUrlParser: true }, 
  () => { console.log('Connected to DB!') }
);

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