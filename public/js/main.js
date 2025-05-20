document.addEventListener('DOMContentLoaded', () => {
  // Fetch dynamic content from backend
  fetch('/api/content')
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll('[data-content]').forEach(element => {
        const section = element.getAttribute('data-content');
        if (data[section]) {
          element.innerHTML = data[section];
        }
      });
      // Update styles
      if (data.styles) {
        document.body.style.backgroundColor = data.styles.backgroundColor || '';
        if (data.styles.backgroundImage) {
          document.body.style.backgroundImage = `url(/uploads/${data.styles.backgroundImage})`;
        }
      }
    })
    .catch(error => console.error('Error fetching content:', error));

  // Contact form submission
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          alert('Error sending message.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error sending message.');
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  document.querySelector('footer p').textContent = `© ${year} Saif Al Mamari Trading Ent. All rights reserved.`;
});