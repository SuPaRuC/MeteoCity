document.addEventListener('DOMContentLoaded', async () => {
  const isLogged = sessionStorage.getItem('logged');

  // Get all the HTML elements
  var login = document.getElementById('login-button');
  var signup = document.getElementById('signup-button');
  var logout = document.getElementById('logout-button');

  try {
    var dashboard = document.getElementById('dashboard');
    var notLoggedDashboard = document.getElementById('not-logged');

    if (isLogged) {
      dashboard.classList.remove('hidden');
      notLoggedDashboard.classList.add('hidden');
    } else {
      dashboard.classList.add('hidden');
      notLoggedDashboard.classList.remove('hidden');
    }
  } catch (err) {
    // Nothing to do, we're not on dashboard page
  }
  
  // If user's not logged show login and signup buttons, otherwise don't
  if (isLogged) {
    login.classList.add('hidden');
    signup.classList.add('hidden');
    logout.classList.remove('hidden');
  } else {
    login.classList.remove('hidden');
    signup.classList.remove('hidden');
    logout.classList.add('hidden');
  }
});