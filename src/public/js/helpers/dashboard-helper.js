document.addEventListener('DOMContentLoaded', async () => {
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
});