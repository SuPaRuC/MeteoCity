async function signup (event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  const response = await fetch("/api/v1/users/signup", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        email: email, 
        password: password, 
        confirmPassword: confirmPassword,
        favourites: []
      }
    )
  });

  const message = await response.json();

  if ('error' in message && message.error !== null) {
    document.getElementById('response').innerText = 'Errore nella registrazione, Info: ' + message.error;
  } else {
    document.getElementById('response').innerText = 'Ti sei registrato!';
  }
}