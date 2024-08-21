// Path: server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');
const bcrypt = require('bcryptjs');

// Create a new user
router.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
            [email, username, hashedPassword]
        );
        client.release();
  
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Sign in a user
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve the user from the database
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        client.release();

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check if the password is correct
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Sign in successful' });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Failed to sign in' });
    }
});

// Follow a user
router.post('/follow', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;

        // Insert the follow relationship into the database, getting userIds from usernames
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO user_friends (user_id, friend_id) VALUES ((SELECT user_id FROM users WHERE username = $1), (SELECT user_id FROM users WHERE username = $2))',
            [username, friendUsername]
        );
        client.release();

        res.status(201).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

// Unfollow a user
router.post('/unfollow', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;

        // Delete the follow relationship from the database, getting userIds from usernames
        const client = await pool.connect();
        const result = await client.query(
            'DELETE FROM user_friends WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND friend_id = (SELECT user_id FROM users WHERE username = $2)',
            [username, friendUsername]
        );
        client.release();

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

// Get the user's following list
router.get('/following', async (req, res) => {
    try {
        const { username } = req.query;

        // Check if the user is following the friend
        const client = await pool.connect();
        const result = await client.query(
            `SELECT u.user_id, u.username 
             FROM users u 
             JOIN user_friends uf ON u.user_id = uf.friend_id 
             WHERE uf.user_id = (SELECT user_id FROM users WHERE username = $1)`,
            [username]
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error checking following status:', error);
        res.status(500).json({ error: 'Failed to check following status' });
    }
});

// Get the user's followers list
router.get('/followers', async (req, res) => {
    try {
        const { username } = req.query;

        // Check if the friend is following the user
        const client = await pool.connect();
        const result = await client.query(
            `SELECT u.user_id, u.username 
             FROM users u 
             JOIN user_friends uf ON u.user_id = uf.user_id 
             WHERE uf.friend_id = (SELECT user_id FROM users WHERE username = $1)`,
            [username]
        );
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error checking followers status:', error);
        res.status(500).json({ error: 'Failed to check followers status' });
    }
});

// Check if current user is following a user
router.get('/is_following', async (req, res) => {
    try {
        const { username, friendUsername } = req.query;

        // Check if the user is following the friend
        const client = await pool.connect();
        const result = await client.query(
            'SELECT EXISTS(SELECT 1 FROM user_friends WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND friend_id = (SELECT user_id FROM users WHERE username = $2))',
            [username, friendUsername]
        );
        client.release();
        console.log('Is following:', result.rows[0].exists);
        res.json(result.rows[0].exists);
    } catch (error) {
        console.error('Error checking following status:', error);
        res.status(500).json({ error: 'Failed to check following status' });
    }
});

// Check if the user exists
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Retrieve the user from the database
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Get username from user_id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the user from the database
        const client = await pool.connect();
        const result = await client.query(
            'SELECT username FROM users WHERE user_id = $1',
            [id]
        );
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

module.exports = router;