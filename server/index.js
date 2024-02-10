require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/movies', require('./routes/movieRoutes'));

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});