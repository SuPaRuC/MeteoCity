// All requires
const express = require('express');
const path = require('path');

// Tell the app to use express to render the pages
const app = express();

// Tell express to look for the static views in public folder
app.use(express.static(path.join(__dirname, 'public')));

// SECTION - Routes
app.get('/', (req, res) => {
  res.render('index.html');
});

// Start listenting to port 3000
app.listen(3000);