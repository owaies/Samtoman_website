// routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required');
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: 'public/images/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!allowed.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
    cb(null, true);
  },
});

// In-memory storage for demo purposes (use a database in production)
let content = {
  home: [
    { heading: 'Welcome to Our Website', paragraph: 'This is the home page.', image: null },
    { heading: 'Our Mission', paragraph: 'To provide the best services.', image: null },
  ],
  about: [
    { heading: 'About Us', paragraph: 'We are a great company.', image: null },
  ],
  services: [
    { heading: 'Service 1', paragraph: 'Description of service 1.', image: null },
    { heading: 'Service 2', paragraph: 'Description of service 2.', image: null },
  ],
  products: [
    { heading: 'Product 1', paragraph: 'Description of product 1.', image: null },
    { heading: 'Product 2', paragraph: 'Description of product 2.', image: null },
  ],
  clients: [
    { heading: 'Our Clients', paragraph: 'We work with amazing clients.', image: null },
  ],
  contact: [
    { heading: 'Contact Us', paragraph: 'Get in touch with us.', image: null },
  ],
  backgroundColor: '#0d1b2a',
  backgroundImage: null,
};

// Simple in-memory user for demo (use a database and proper password hashing in production)
const adminUser = { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin');
}

// Render admin page
router.get('/admin', (req, res) => {
  res.render('admin', { content });
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

// Handle logout
router.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin');
});

// Handle content save with multiple file uploads
router.post('/admin/save', isAuthenticated, upload.any(), (req, res) => {
  const { home, about, services, products, clients, contact, backgroundColor } = req.body;

  // Helper function to process sections
  const processSections = (sections, pageKey) => {
    if (!sections) return content[pageKey]; // If no sections provided, return existing
    const parsedSections = Array.isArray(sections) ? sections : [sections];
    return parsedSections.map((section, index) => {
      const imageField = req.files.find(file => file.fieldname === `${pageKey}[${index}][image]`);
      return {
        heading: section.heading || content[pageKey][index]?.heading || '',
        paragraph: section.paragraph || content[pageKey][index]?.paragraph || '',
        image: imageField ? imageField.filename : content[pageKey][index]?.image || null,
      };
    });
  };

  // Update content
  content = {
    home: processSections(home, 'home'),
    about: processSections(about, 'about'),
    services: processSections(services, 'services'),
    products: processSections(products, 'products'),
    clients: processSections(clients, 'clients'),
    contact: processSections(contact, 'contact'),
    backgroundColor: backgroundColor || content.backgroundColor,
    backgroundImage: req.files.find(file => file.fieldname === 'backgroundImage')?.filename || content.backgroundImage,
  };

  res.status(200).send('Changes saved');
});

module.exports = router;
module.exports.content = content; // Export content for use in other routes