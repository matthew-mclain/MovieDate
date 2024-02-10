// Path: server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const options = {
  method: 'GET',
  url: `${process.env.TMDB_BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`,
  headers: {
    accept: 'application/json',
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

module.exports = router;