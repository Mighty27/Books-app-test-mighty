const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Routes tetap sama, tapi untuk functions, wrap dengan handler
exports.handler = async (event, context) => {
    // Contoh sederhana: return JSON untuk /api/books
    if (event.path === '/api/books' && event.httpMethod === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM books ORDER BY date_added DESC');
            return { statusCode: 200, body: JSON.stringify(result.rows) };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
    }
    // Tambahkan handler untuk POST /api/books, dll.
    return { statusCode: 404, body: 'Not Found' };
};
