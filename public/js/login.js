document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Login successful:', data);
        window.location.href = '/dashboard';  // Redirect to dashboard after successful login
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid login credentials.');
      });
  });
  