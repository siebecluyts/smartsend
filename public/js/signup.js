document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
  
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sign-up successful:', data);
        window.location.href = '/dashboard';  // Redirect to dashboard after successful signup
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error during sign-up.');
      });
  });
  