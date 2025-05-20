document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const contentForm = document.querySelector('#content-form');

  // Handle login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      try {
        const response = await fetch('/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = '/admin-panel';
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Login error');
      }
    });
  }

  // Handle content updates
  if (contentForm) {
    // Fetch current content
    fetch('/api/content', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(data => {
        document.querySelector('#home-content').value = data.home || '';
        document.querySelector('#about-content').value = data.about || '';
        document.querySelector('#services-content').value = data.services || '';
        document.querySelector('#products-content').value = data.products || '';
        document.querySelector('#clients-content').value = data.clients || '';
        document.querySelector('#contact-content').value = data.contact || '';
        document.querySelector('#background-color').value = data.styles?.backgroundColor || '#0d1b2a';
      })
      .catch(error => console.error('Error fetching content:', error));

    // Submit updates
    contentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contentForm);
      const data = Object.fromEntries(formData);
      try {
        const response = await fetch('/admin/update-content', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          alert('Content updated successfully!');
        } else {
          alert('Error updating content.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error updating content.');
      }
    });
  }
});