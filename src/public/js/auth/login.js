async function login (event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/v1/users/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        email: email, 
        password: password
      }
    )
  });

  const message = await response.json();

  if (message === null) {
    document.getElementById('response').innerText = 'Non riusciamo a trovarti 😢 Controlla le credenziali!';
  } else {
    sessionStorage.setItem('logged', true);
    sessionStorage.setItem('email', message.email);
    location.href = '/';
  }
}