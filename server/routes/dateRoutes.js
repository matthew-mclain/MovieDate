// Path: server/routes/dateRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');

// Add date to dates
router.post('/add', async (req, res) => {
    const {username, date, time, theater, invitedUsers } = req.body;

    // Check if time is empty and set it to null
    const timeValue = time === '' ? null : time;

    try {
        const user = await pool.query('SELECT user_id FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user.rows[0].user_id;

        const newDate = await pool.query(
            'INSERT INTO dates (movie_id, user_id, date, time, theater, invited_users) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.body.movieId, userId, date, timeValue, theater, invitedUsers]
        )
        res.json(newDate.rows[0]);
    } catch (error) {
        console.error('Error adding date:', error);
        res.status(500).json({ error: 'Failed to add date' });
    }
});

// Get dates for a user including if user_id is in invited_users, with movie poster
router.get('/', async (req, res) => {
    const { username, selectedFilters } = req.query;

    try {
        let query = `
            SELECT dates.*, movies.poster_path 
            FROM dates 
            JOIN movies ON dates.movie_id = movies.movie_id`;

        // Add filters to the query
        if (selectedFilters && selectedFilters.length > 0) {
            const filterConditions = selectedFilters.map(filter => {
                if (filter === 'me') {
                    return 'user_id = (SELECT user_id FROM users WHERE username = $1)';
                } else if (filter === 'others') {
                    // Check if the provided username exists in the invited_users array
                    return '$1 = ANY(dates.invited_users)';
                }
            });
            query += ' WHERE ' + filterConditions.join(' OR ');
        } else {
            query += ' WHERE user_id = (SELECT user_id FROM users WHERE username = $1) OR $1 = ANY(dates.invited_users)';
        }

        const dates = await pool.query(query, [username]);
        res.json(dates.rows);
        console.log(query);
        console.log(dates.rows);
    } catch (error) {
        console.error('Error getting dates:', error);
        res.status(500).json({ error: 'Failed to get dates' });
    }
});


module.exports = router;