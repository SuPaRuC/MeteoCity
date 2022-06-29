document.addEventListener('DOMContentLoaded', async () => {
  const isLogged = sessionStorage.getItem('logged');

  // Get all the HTML elements
  var login = document.getElementById('login-button');
  var signup = document.getElementById('signup-button');
  var logout = document.getElementById('logout-button');

  /*
    If we're on cities section we have to make sure that the favourites
    button is shown only whenever a user is logged in
  */
  try {
    var favourites = document.getElementById('button-favs');

    if (isLogged) {
      favourites.classList.remove('hidden');
    } else {
      favourites.classList.add('hidden');
    }
  } catch (err) {
    // Do nothing since we're not on cities section
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