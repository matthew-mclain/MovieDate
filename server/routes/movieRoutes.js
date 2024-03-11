// Path: server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');

// Populate the database with upcoming movies
router.post('/populate', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1); // Get date one year from now
    const oneYearFromNowDate = oneYearFromNow.toISOString().split('T')[0]; // Get one year from now date in YYYY-MM-DD format

    let page = 1;
    let allMovies = [];

    while (true) {
      const params = {
        api_key: process.env.TMDB_API_KEY,
        page: page,
        'release_date.gte': currentDate,
        'release_date.lte': oneYearFromNowDate,
        include_adult: false,
        include_video: false,
        language: 'en-US',
        region: 'US',
        with_release_type: '2|3' // Specify release types 2 (digital) and 3 (theatrical)
      };

      const response = await axios.get(`${process.env.TMDB_BASE_URL}/discover/movie`, { params });
      const { results, total_pages } = response.data;

      allMovies = allMovies.concat(results);

      if (page >= total_pages) break; // Stop fetching when all pages have been retrieved

      page++;
    }

    // Insert movies into the database if they don't already exist
    const client = await pool.connect();
    await client.query('BEGIN');

    await Promise.all(allMovies.map(async (movie) => {
      const { id } = movie;

      // Check if the movie already exists in the database
      const existingMovie = await client.query('SELECT movie_id FROM movies WHERE movie_id = $1', [id]);

      if (existingMovie.rows.length === 0) {
        const { title, original_title, original_language, release_date, genres, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity } = movie;
        await client.query('INSERT INTO movies (movie_id, title, original_title, original_language, release_date, genres, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id, title, original_title, original_language, release_date, genres, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity]);
      }
    }));

    await client.query('COMMIT');
    client.release();

    res.json(allMovies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get upcoming movies
router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM movies');
    client.release();
    const movies = result.rows;
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming movies from the database: ' + error.message });
  }
});

//Individual movie
router.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const params = {
      api_key: process.env.TMDB_API_KEY
    };

    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/${movieId}`, { params });

    const movieDetails = response.data;
    res.json(movieDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;