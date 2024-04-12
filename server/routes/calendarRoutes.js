// Path: server/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');

// Add movie to user's calendar
router.post('/add', async (req, res) => {
    try {
        const { username, movieId } = req.body;

        // Check if movie is already in user's calendar
        const client = await pool.connect();
        const result = await client.query(
            'SELECT EXISTS(SELECT 1 FROM user_movies WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND movie_id = $2)',
            [username, movieId]
        );

        if (result.rows[0].exists) {
            client.release();
            return res.status(400).json({ error: 'Movie already exists in the user\'s calendar' });
        }

        // Insert the movie into the user's calendar
        await client.query(
            'INSERT INTO user_movies (user_id, movie_id) VALUES ((SELECT user_id FROM users WHERE username = $1), $2)',
            [username, movieId]
        );
        client.release();

        res.status(201).json({ message: 'Movie added to calendar successfully' });
    } catch (error) {
        console.error('Error adding movie to calendar:', error);
        res.status(500).json({ error: 'Failed to add movie to calendar' });
    }
});

// Get user's calendar
router.get('/', async (req, res) => {
    try {
        const { username, movieId } = req.query;

        // Retrieve the user's ID
        const client = await pool.connect();
        const result = await client.query(
            'SELECT EXISTS(SELECT 1 FROM user_movies WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND movie_id = $2)',
            [username, movieId]
        );

        client.release();

        const exists = result.rows[0].exists; // Extract exists value from the result

        res.json({ exists });
    } catch (error) {
        console.error('Error fetching user calendar:', error);
        res.status(500).json({ error: 'Failed to fetch user calendar' });
    }
});

// Delete movie from user's calendar

module.exports = router;