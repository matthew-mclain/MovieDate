require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/movies', require('./routes/movieRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/calendar', require('./routes/calendarRoutes'));
app.use('/search', require('./routes/searchRoutes'));
app.use('/dates', require('./routes/dateRoutes'));

// Update the database with upcoming movies
const updateMovies = async () => {
    try {
        const response = await axios.post('http://backend:8000/movies/populate');
        console.log("Movies table updated successfully.", response.data.length, "movies added.");
    } catch (error) {
        console.error("Failed to update movies table:", error.message);
    }
}

// Delete movies if release date is six months old
const deleteMovies = async () => {
    try {
        const response = await axios.delete('http://backend:8000/movies/delete');
        console.log("Old movies deleted successfully.");
    } catch (error) {
        console.error("Failed to update movies table:", error.message);
    }
}

// Delete dates if date is in the past
const deleteDates = async () => {
    try {
        const response = await axios.delete('http://backend:8000/dates/delete_old');
        console.log("Old dates deleted successfully.");
    } catch (error) {
        console.error("Failed to update dates table:", error.message);
    }
}

// Set interval to update database every 24 hours
const updateInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Start the server
app.listen(8000, async () => {
    try {
        await updateMovies(); // Update movies table
        await deleteMovies(); // Delete old movies
        await deleteDates(); // Delete old dates
        console.log('Server is running on port 8000');

        // Set interval to update database every 24 hours
        setInterval(async () => {
            await updateMovies(); // Update movies table
            await deleteMovies(); // Delete old movies
            await deleteDates(); // Delete old dates
        }, updateInterval);
    } catch (error) {
        console.error("Failed to update movies table:", error.message);
    }
});