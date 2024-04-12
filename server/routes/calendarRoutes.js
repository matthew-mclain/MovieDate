// Path: server/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');

// Add movie to user's calendar
router.post('/add', async (req, res) => {
    try {
        const { username, movieId } = req.body;

        // Retrieve the user's ID
        const client = await pool.connect();
        let result = await client.query(
            'SELECT user_id FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            client.release();
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = result.rows[0].user_id; // Extract user_id from the result

        // Insert the movie into the user's calendar
        result = await client.query(
            'INSERT INTO user_movies (user_id, movie_id) VALUES ($1, $2)',
            [userId, movieId]
        );
        client.release();

        res.status(201).json({ message: 'Movie added to calendar successfully' });
    } catch (error) {
        console.error('Error adding movie to calendar:', error);
        res.status(500).json({ error: 'Failed to add movie to calendar' });
    }
});

// Get user's calendar

// Delete movie from user's calendar

module.exports = router;