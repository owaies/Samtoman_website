// routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { createUploadFilename, hasSupportedImageSignature, uploadLimits } = require('../utils/admin-upload');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required');
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: 'public/images/',
  filename: (req, file, cb) => {
    cb(null, createUploadFilename(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: uploadLimits,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = new Map([
      ['.jpg', 'image/jpeg'],
      ['.jpeg', 'image/jpeg'],
      ['.png', 'image/png'],
      ['.webp', 'image/webp'],
      ['.gif', 'image/gif'],
    ]);
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.get(extension) !== file.mimetype) {
      return cb(new Error('Upload a JPEG, PNG, WebP, or GIF image with a matching file extension'));
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
router.post('/admin/login', (req, res, next) => {
  const { username, password } = req.body;
  if (username !== adminUser.username || password !== adminUser.password) {
    return res.status(401).send('Invalid username or password');
  }

  req.session.regenerate((err) => {
    if (err) {
      return next(err);
    }
    req.session.isAuthenticated = true;
    req.session.save((saveError) => {
      if (saveError) {
        return next(saveError);
      }
      res.status(200).send('Login successful');
    });
  });
});

// Handle logout
router.post('/admin/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(204).end();
  });
});

async function isValidUploadedImage(file) {
  const handle = await fs.open(file.path, 'r');
  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    const extension = path.extname(file.originalname).toLowerCase();
    return hasSupportedImageSignature(header.subarray(0, bytesRead), extension);
  } finally {
    await handle.close();
  }
}

async function removeUploadedFiles(files) {
  await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => undefined)));
}

// Handle content save with multiple file uploads
router.post('/admin/save', isAuthenticated, upload.any(), async (req, res, next) => {
  const uploadedFiles = Array.isArray(req.files) ? req.files : [];
  try {
    for (const file of uploadedFiles) {
      if (!(await isValidUploadedImage(file))) {
        await removeUploadedFiles(uploadedFiles);
        return res.status(400).send('Uploaded file content must match its image extension.');
      }
    }
  } catch (error) {
    await removeUploadedFiles(uploadedFiles);
    return next(error);
  }

  const { home, about, services, products, clients, contact, backgroundColor } = req.body;

  // Helper function to process sections
  const processSections = (sections, pageKey) => {
    if (!sections) return content[pageKey]; // If no sections provided, return existing
    const parsedSections = Array.isArray(sections) ? sections : [sections];
    return parsedSections.map((section, index) => {
      const imageField = uploadedFiles.find(file => file.fieldname === `${pageKey}[${index}][image]`);
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
    backgroundImage: uploadedFiles.find(file => file.fieldname === 'backgroundImage')?.filename || content.backgroundImage,
  };

  res.status(200).send('Changes saved');
});

module.exports = router;
module.exports.content = content; // Export content for use in other routes
