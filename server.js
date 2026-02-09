const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Koneksi ke Neon DB
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files dari folder public

// Route utama: Daftar buku baru
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY date_added DESC LIMIT 10');
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching books');
    }
});

// API untuk mendapatkan buku (untuk frontend)
app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY date_added DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching books' });
    }
});

// Route mode penulis
app.get('/author', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'author.html'));
});

// API untuk menambahkan buku baru
app.post('/api/books', async (req, res) => {
    const { title, content, author } = req.body;
    try {
        await pool.query('INSERT INTO books (title, content, author) VALUES ($1, $2, $3)', [title, content, author]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding book');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});