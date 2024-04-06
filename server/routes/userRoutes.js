// Path: server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');
const bcrypt = require('bcrypt');

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

module.exports = router;