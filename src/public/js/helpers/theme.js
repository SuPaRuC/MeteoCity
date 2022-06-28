// This file contains functions about dark-light mode themes

// This function load the mode when entering a page
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
function checkTheme () {
  const darkTheme = document.getElementById('darkModeToggle').checked;

  if (darkTheme) {
    activateDarkMode();
  } else {
    activateLightMode();
  }
}

// This function activate the dark mode
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
function activateDarkMode () {
  // Replace all the instance in the file from ligth to dark mode
  document.querySelectorAll('.bg-light').forEach((element) => {
    element.className = element.className.replace(/-light/g, '-dark');
  });

  // Add dark background to body
  document.body.classList.add('bg-dark');

  // Replace all the light text to dark text if any
  if (document.body.classList.contains('text-dark')) {
    document.body.classList.replace('text-dark', 'text-light');
  } else {
    document.body.classList.add('text-light');
  }

  // Change the login and signup buttons
  var loginButton = document.getElementById('login-button');
  var signupButton = document.getElementById('signup-button');
  loginButton.classList.replace('btn-outline-dark', 'btn-outline-light');
  signupButton.classList.replace('btn-outline-dark', 'btn-outline-light');

  // Save the theme to localstorage
  const theme = {
    darkTheme: true,
    date: new Date().getTime()
  }

  localStorage.setItem('Theme', JSON.stringify(theme));
}

// This function activate the light mode
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
function activateLightMode () {
  // Replace all the instance in the file from dark to light mode
  document.querySelectorAll('.bg-dark').forEach((element) => {
    element.className = element.className.replace(/-dark/g, '-light');
  });

  // Add light background to body
  document.body.classList.add('bg-light');

  // Replace all the dark text to ligth text if any
  if (document.body.classList.contains('text-light')) {
    document.body.classList.replace('text-light', 'text-dark');
  } else {
    document.body.classList.add('text-dark');
  }

  // Change the login and signup buttons
  var loginButton = document.getElementById('login-button');
  var signupButton = document.getElementById('signup-button');
  loginButton.classList.replace('btn-outline-light', 'btn-outline-dark');
  signupButton.classList.replace('btn-outline-light', 'btn-outline-dark');

  // Save the theme to localstorage
  const theme = {
    darkTheme: false,
    date: new Date().getTime()
  }

  localStorage.setItem('Theme', JSON.stringify(theme));
}

// This function load the theme from localstorage when pages loads
// @author Luca Parenti <luca.parenti1@studenti.unimi.it>
function loadTheme () {
  var theme = localStorage.getItem('Theme');

  if (theme != null) {
    theme = JSON.parse(theme);
    var date = theme.date;
    var today = new Date().getTime();

    if (today - date < (1000 * 86400)) {
      if (theme.darkTheme) {
        activateDarkMode();
        document.getElementById('darkModeToggle').checked = true;
      } else {
        activateLightMode();
        document.getElementById('darkModeToggle').checked = false;
      }
    } else {
      localStorage.clear();
    }
  } else {
    activateLightMode();
  }
}

// Calls the load theme function on page load
document.addEventListener('DOMContentLoaded', loadTheme());