// public/js/admin.js

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Hide login section and show admin panel
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('admin-section').style.display = 'block';
    } else {
      const error = await response.text();
      alert(error || 'Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
});

// Handle content form submission
document.getElementById('content-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = {
    home: formData.get('home'),
    about: formData.get('about'),
    services: formData.get('services'),
    products: formData.get('products'),
    clients: formData.get('clients'),
    contact: formData.get('contact'),
    backgroundColor: formData.get('backgroundColor'),
    backgroundImage: formData.get('backgroundImage') ? formData.get('backgroundImage').name : null, // Only send file name (server handles file upload)
  };

  try {
    const response = await fetch('/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Changes saved successfully!');
    } else {
      const error = await response.text();
      alert(error || 'Failed to save changes');
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('An error occurred while saving changes');
  }
});