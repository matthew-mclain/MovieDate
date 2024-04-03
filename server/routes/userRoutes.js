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

module.exports = router;