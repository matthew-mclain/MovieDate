// Path: server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const movies = await axios.get(`${process.env.TMDB_BASE_URL}/movie/now_playing`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });
    res.json(movies.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
);

module.exports = router;