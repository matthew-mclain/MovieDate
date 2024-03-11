// Path: server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Upcoming movies
router.get('/', async (req, res) => {
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

    res.json(allMovies);
  } catch (error) {
    res.status(400).json({ error: error.message });
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