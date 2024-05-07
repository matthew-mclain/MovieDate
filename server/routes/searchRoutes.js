// server/routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Search for movies and users
router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        const client = await pool.connect();

        // Search for movies
        const moviesResult = await client.query (
            `SELECT * FROM movies WHERE title ILIKE $1`,
            [`%${query}%`]
        );

        // Search for users
        const usersResult = await client.query (
            `SELECT * FROM users WHERE username ILIKE $1`,
            [`%${query}%`]
        );

        client.release();
        res.json({
            movies: moviesResult.rows,
            users: usersResult.rows
        });
        console.log('movies:', moviesResult.rows);
        console.log('users:', usersResult.rows);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Failed to search' });
    }
});

module.exports = router;