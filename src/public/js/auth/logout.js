async function logout() {
  // Clear session storage
  sessionStorage.clear();

  // Clear express storage
  const response = await fetch('/api/v1/users/logout');
  console.log(response);
}