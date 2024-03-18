// Path: server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Populate the database with upcoming movies, update them if they already exist
router.post('/populate', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    let page = 1;
    let allMovies = [];

    while (true) {
      const params = {
        api_key: process.env.TMDB_API_KEY,
        page: page,
        'release_date.gte': currentDate,
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

    // Insert or update the movies in the database
    const client = await pool.connect();
    await client.query('BEGIN');

    await Promise.all(allMovies.map(async (movie) => {
      const { id, title, original_title, original_language, release_date, genre_ids, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity } = movie;

      // Map genre IDs to genre names
      const genres = genre_ids.map(genreId => genreMap[genreId]);

      // Check if the movie already exists in the database
      const existingMovie = await client.query('SELECT movie_id FROM movies WHERE movie_id = $1', [id]);

      if (existingMovie.rows.length === 0) {
        // Movie does not exist, insert it into the database
        await client.query('INSERT INTO movies (movie_id, title, original_title, original_language, release_date, genres, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id, title, original_title, original_language, release_date, genres, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity]);
      } else {
        // Movie exists, update its details in the database
        await client.query('UPDATE movies SET title = $1, original_title = $2, original_language = $3, release_date = $4, genres = $5, overview = $6, runtime = $7, poster_path = $8, backdrop_path = $9, vote_average = $10, vote_count = $11, popularity = $12 WHERE movie_id = $13', [title, original_title, original_language, release_date, genres, overview, runtime, poster_path, backdrop_path, vote_average, vote_count, popularity, id]);
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
router.get('/upcoming', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM movies WHERE release_date >= $1 ORDER BY popularity DESC', [currentDate]);
    client.release();
    const movies = result.rows;
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming movies from the database: ' + error.message });
  }
});

// Get individual movie
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
    res.status(400).json({ error: 'Failed to get movie from the database: ' + error.message });
  }
});

// Delete movies if release date is a year old
router.delete('/delete', async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearAgoDate = oneYearAgo.toISOString().split('T')[0]; // Get date one year ago in YYYY-MM-DD format

    const client = await pool.connect();
    await client.query('DELETE FROM movies WHERE release_date < $1', [oneYearAgoDate]);
    client.release();
    res.json({ message: 'Movies released over a year ago have been deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete old movies from the database: ' + error.message });
  }
});

module.exports = router;