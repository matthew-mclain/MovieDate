// server/routes/showtimeRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Search for movie in MovieGlu API and get showtimes
router.get('/search', async (req, res) => {
    try {
        const title = req.query.title;
        const releaseDate = new Date(req.query.releaseDate).toISOString().split('T')[0];
        const desiredDate = new Date(req.query.desiredDate).toISOString().split('T')[0];
        
        // Get current device datetime
        const deviceDatetime = new Date().toISOString();

        // Get latitude and longitude from IP address
        const ipResponse = await axios.get('https://ipapi.co/json/');
        const { latitude, longitude } = ipResponse.data;
        console.log('Latitude:', latitude, 'Longitude:', longitude);

        // Make request to MovieGlu API
        const moviesResponse = await axios.get(`${process.env.MOVIEGLU_BASE_URL}filmLiveSearch/`, {
            headers: {
                client: process.env.MOVIEGLU_CLIENT,
                'x-api-key': process.env.MOVIEGLU_API_KEY,
                authorization: process.env.MOVIEGLU_AUTHORIZATION,
                territory: 'US',
                'api-version': 'v200',
                geolocation: latitude + ';' + longitude,
                'device-datetime': deviceDatetime,
            },
            params: {
                query: title,
            }
        })

        // Extract the film ID from the response for the movie matching the title and release date
        let filmId;
        const films = moviesResponse.data.films;
        for (const film of films) {
            const filmReleaseDate = new Date(film.release_dates[0].release_date).toISOString().split('T')[0];
            if (film.film_name === title && filmReleaseDate === releaseDate) {
                filmId = film.film_id;
                break;
            }
        }

        if (!filmId) {
            return res.status(404).json({ error: 'Film not found' });
        }

        // Get showtimes for the film
        const showtimesResponse = await axios.get(`${process.env.MOVIEGLU_BASE_URL}filmShowTimes/`, {
            headers: {
                client: process.env.MOVIEGLU_CLIENT,
                'x-api-key': process.env.MOVIEGLU_API_KEY,
                authorization: process.env.MOVIEGLU_AUTHORIZATION,
                territory: 'US',
                'api-version': 'v200',
                geolocation: latitude + ';' + longitude,
                'device-datetime': deviceDatetime,
            },
            params: {
                film_id: filmId,
                date: desiredDate,
            }
        });

        res.json(showtimesResponse.data);
        console.log('Showtimes fetched from the MovieGlu API:', showtimesResponse.data);
    }
    catch (error) {
        console.error('Error searching for movie:', error);
        res.status(500).json({ error: 'Failed to search for movie' });
    }
});

module.exports = router;