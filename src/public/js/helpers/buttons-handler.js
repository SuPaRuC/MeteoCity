document.addEventListener('DOMContentLoaded', async () => {
  const isLogged = sessionStorage.getItem('logged');

  // Get all the HTML elements
  var login = document.getElementById('login-button');
  var signup = document.getElementById('signup-button');
  var logout = document.getElementById('logout-button');
  
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