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
        const { username } = req.query;

        // Retrieve the user's ID from their username
        const client = await pool.connect();
        const result = await client.query(
            'SELECT user_id FROM users WHERE username = $1',
            [username]
        );
        const userId = result.rows[0].user_id;

        // Retrieve the movie_ids from the user_movies table with the user's ID
        const userMovies = await client.query(
            'SELECT movie_id FROM user_movies WHERE user_id = $1',
            [userId]
        );
        const movieIds = userMovies.rows.map(movie => movie.movie_id);

        // Retrieve the movies from the movies table with the movie_ids
        const movies = [];
        for (const movieId of movieIds) {
            const movie = await client.query(
                'SELECT * FROM movies WHERE movie_id = $1',
                [movieId]
            );
            movies.push(movie.rows[0]);
        }

        // Sort the movies by release date
        movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        client.release();

        res.json(movies);
    } catch (error) {
        console.error('Error fetching user\'s calendar:', error);
        res.status(500).json({ error: 'Failed to fetch user\'s calendar' });
    }
});

// Delete movie from user's calendar
router.delete('/delete', async (req, res) => {
    try {
        const { username, movieId } = req.body;

        // Delete the movie from the user's calendar
        const client = await pool.connect();
        await client.query(
            'DELETE FROM user_movies WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND movie_id = $2',
            [username, movieId]
        );
        client.release();

        res.json({ message: 'Movie deleted from calendar successfully' });
    } catch (error) {
        console.error('Error deleting movie from calendar:', error);
        res.status(500).json({ error: 'Failed to delete movie from calendar' });
    }
});

module.exports = router;