const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saif_almamari_db',
  waitForConnections: true,
  connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0
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
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  if (cleanName.length < 2 || cleanName.length > 100 || cleanEmail.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail) || cleanMessage.length < 5 || cleanMessage.length > 5000) {
    return res.status(400).json({ message: 'Please provide a valid name, email, and message.' });
  }
  try {
    await pool.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [cleanName, cleanEmail, cleanMessage]);
    res.json({ message: 'Message saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;