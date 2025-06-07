document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const mobile = document.getElementById('mobile').value;
  const errorMessage = document.getElementById('error-message');

  // Clear any previous error message
  errorMessage.textContent = '';

  // Simple validation
  if (!username || !email || !mobile || mobile.length !== 10) {
    errorMessage.textContent = 'Please fill out all fields correctly.';
    return;
  }

  alert('Login successful!');

  // Clear form after successful login
  document.getElementById('loginForm').reset();
});
