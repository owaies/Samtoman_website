const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'owaies',
  database: 'saif_almamari_db'
});

// Serve public pages
router.get('/', (req, res) => res.render('index'));
router.get('/about', (req, res) => res.render('#aboutus'));
router.get('/services', (req, res) => res.render('services'));
router.get('/products', (req, res) => res.render('products'));
router.get('/clients', (req, res) => res.render('clients'));
router.get('/contact', (req, res) => res.render('contact'));

// API to fetch dynamic content
router.get('/api/content', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM content WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API to handle contact form submissions
router.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.json({ message: 'Message saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;