document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  console.log('Mobile Menu Toggle:', mobileMenuToggle); // Should log the button element
  console.log('Mobile Nav:', mobileNav); // Should log the nav element

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      console.log('Toggle clicked!'); // Should log on click
      mobileNav.classList.toggle('active');
      mobileMenuToggle.textContent = mobileNav.classList.contains('active') ? '✖' : '☰';
    });
  } else {
    console.error('Mobile menu toggle or nav not found!');
  }
});