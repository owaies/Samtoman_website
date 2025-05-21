// routes/admin.js

const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes (use a database in production)
let content = {
  home: '',
  about: '',
  services: '',
  products: '',
  clients: '',
  contact: '',
  backgroundColor: '#0d1b2a',
  backgroundImage: null,
};

// Simple in-memory user for demo (use a database and proper password hashing in production)
const adminUser = { username: 'admin', password: 'password' }; // Replace with secure credentials

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin'); // Redirect to login if not authenticated
}

// Render admin page (login or panel based on session)
router.get('/admin', (req, res) => {
  res.render('admin', { content }); // Pass content to populate textareas (optional)
});

// Handle login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser.username && password === adminUser.password) {
    req.session.isAuthenticated = true;
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Handle content save
router.post('/admin/save', isAuthenticated, (req, res) => {
  const {
    home,
    about,
    services,
    products,
    clients,
    contact,
    backgroundColor,
    backgroundImage,
  } = req.body;

  // Update in-memory content
  content = {
    home: home || content.home,
    about: about || content.about,
    services: services || content.services,
    products: products || content.products,
    clients: clients || content.clients,
    contact: contact || content.contact,
    backgroundColor: backgroundColor || content.backgroundColor,
    backgroundImage: backgroundImage || content.backgroundImage,
  };

  res.status(200).send('Changes saved');
});

module.exports = router;