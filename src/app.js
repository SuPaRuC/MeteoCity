// All requires
const { hashPwd } = require('./public/js/helpers/pwd-hasher');
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

// Every time we get a request we make sure that's correctly interpretated
app.use(bodyParser.urlencoded({ extended: true }));

// Tell app to use cookie parser
app.use(cookieParser());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  // secure: true require HTTPS wich we don't have since we're on localhost, maxAge in milliseconds
  cookie: {secure: false, maxAge: 3600000} 
}));

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

app.get('/login', (req, res) => {
  res.render('login.html');
});

app.get('/dashboard', async (req, res) => {
  if (req.session.email !== undefined) {
    const response = await User.findOne({
      email: req.session.email
    });

    res.render('dashboard', {favourites: response.favourites});
  } else {
    res.render('login.html');
  }
});

// SECTION - DB connection
mongoose.connect(
  process.env.MONGODB_CONN, 
  { useNewUrlParser: true }, 
  () => { console.log('Connected to DB!') }
);

// SECTION - Weather APIs
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

// SECTION - User APIs
app.post('/api/v1/users/signup', async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: hashPwd(req.body.password),
    favourites: req.body.favourites
  });

  const confirm = hashPwd(req.body.confirmPassword);

  if (user.password === confirm) {
    await user.save()
      .then(data => {
        res.status(200);
        res.json(data);
      })
      .catch(err => {
        res.statusMessage = 'Errore in fase di creazione utente';
        res.status(422);
        res.json({error: `Errore, Info: ${err}`});
      })
  } else {
    res.status(400);
    res.json({error: 'Le password non coincidono!'});
  }
});

app.post('/api/v1/users/login', async (req, res) => {
  await User.findOne({
    email: req.body.email,
    password: hashPwd(req.body.password)
  }).then(data => {
    req.session.email = req.body.email;
    res.status(200);
    res.json(data);
  }).catch(err => {
    res.status(400);
    res.send({error: `Info: ${err}`})
  });
});

app.get('/api/v1/users/logout', async (req, res) => {
  if (req.session.email !== undefined) {
    req.session.destroy();
  }
});

// SECTION - favourites city
app.post('/api/v1/users/get-favourites', async (req, res) => {
  await User.findOne({
    email: req.body.email
  }).then(data => {
    res.status(200);
    res.json(data.favourites);
  }).catch(err => {
    res.status(400);
    res.send({error: `Info: ${err}`})
  });
});

app.patch('/api/v1/users/update-favourite', async (req, res) => {
  const email = req.body.email;
  const cityName = req.body.cityName;
  var favourites = req.body.favourites;
  
  if (cityName !== '') {
    favourites.push(cityName);
  }

  await User.updateOne(
    { email: email }, 
    { $set: { favourites: favourites } }
  ).then(data => {
    res.status(200);
    res.json({data: data, status: 200})
  }).catch(err => {
    res.status(422);
    res.send({error: `Info: ${err}`})
  })
});

// Catch all routes not defined to show custom 404 page
app.use((req, res, next) => {
  res.status(404);
  res.render('404.html');
});

// Start listenting to port 3000
app.listen(3000);