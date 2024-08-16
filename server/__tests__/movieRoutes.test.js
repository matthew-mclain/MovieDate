// __tests__/movieRoutes.test.js
const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/movieRoutes');
const pool = require('../db');
const axios = require('axios');

// Mock axios and database connection
jest.mock('axios');
jest.mock('../db');

app.use(express.json());
app.use('/movies', router);

describe('Movie Routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /movies/populate', () => {
        it('should populate the database with movies', async () => {
            // Mock response from TMDB API
            axios.get.mockResolvedValue({
                data: {
                    results: [{ id: 1, title: 'Movie Title', genre_ids: [28] }],
                    total_pages: 1
                }
            });

            // Mock database connection and queries
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] }),
                query: jest.fn().mockResolvedValue({ rows: [] }),
                release: jest.fn()
            });

            const response = await request(app).post('/movies/populate');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, title: 'Movie Title', genre_ids: [28] }]);
            console.log('POST /movies/populate response:', response.body);
        });

        it('should handle errors during population', async () => {
            // Mock response from TMDB API
            axios.get.mockRejectedValue(new Error('API Error'));

            const response = await request(app).post('/movies/populate');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('API Error');
            console.log('POST /movies/populate error response:', response.body);
        });
    });

    describe('GET /movies', () => {
        it('should get all movies', async () => {
            // Mock database query
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [{ id: 1, title: 'Movie Title' }] }),
                release: jest.fn()
            });

            const response = await request(app).get('/movies');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, title: 'Movie Title' }]);
            console.log('GET /movies response:', response.body);
        });

        it('should handle errors during fetching movies', async () => {
            // Mock database query error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValue(new Error('Database Error')),
                release: jest.fn()
            });

            const response = await request(app).get('/movies');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to fetch movies from the database: Database Error');
            console.log('GET /movies error response:', response.body);
        });
    });

    describe('GET /movies/upcoming', () => {
        it('should get upcoming movies', async () => {
            // Mock database query
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [{ id: 1, title: 'Upcoming Movie' }] }),
                release: jest.fn()
            });

            const response = await request(app).get('/movies/upcoming');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, title: 'Upcoming Movie' }]);
            console.log('GET /movies/upcoming response:', response.body);
        });

        it('should handle errors during fetching upcoming movies', async () => {
            // Mock database query error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValue(new Error('Database Error')),
                release: jest.fn()
            });

            const response = await request(app).get('/movies/upcoming');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to fetch upcoming movies from the database: Database Error');
            console.log('GET /movies/upcoming error response:', response.body);
        });
    });

    describe('GET /movies/now_playing', () => {
        it('should get now playing movies', async () => {
            // Mock database query
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [{ id: 1, title: 'Now Playing Movie' }] }),
                release: jest.fn()
            });

            const response = await request(app).get('/movies/now_playing');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, title: 'Now Playing Movie' }]);
            console.log('GET /movies/now_playing response:', response.body);
        });

        it('should handle errors during fetching now playing movies', async () => {
            // Mock database query error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValue(new Error('Database Error')),
                release: jest.fn()
            });

            const response = await request(app).get('/movies/now_playing');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to fetch now playing movies from the database: Database Error');
            console.log('GET /movies/now_playing error response:', response.body);
        });
    });

    describe('GET /movies/:id', () => {
        it('should get a movie by ID', async () => {
            // Mock database query
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [{ id: 1, title: 'Movie Title' }] }),
                release: jest.fn()
            });

            const response = await request(app).get('/movies/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, title: 'Movie Title' });
            console.log('GET /movies/1 response:', response.body);
        });

        it('should handle errors during fetching a movie by ID', async () => {
            // Mock database query error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValue(new Error('Database Error')),
                release: jest.fn()
            });

            const response = await request(app).get('/movies/1');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to fetch movie from the database: Database Error');
            console.log('GET /movies/1 error response:', response.body);
        });
    });

    describe('DELETE /movies/delete', () => {
        it('should delete movies older than three months', async () => {
            // Mock database query
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [] }),
                release: jest.fn()
            });

            const response = await request(app).delete('/movies/delete');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Movies released over a three months ago have been deleted');
            console.log('DELETE /movies/delete response:', response.body);
        });

        it('should handle errors during deletion of old movies', async () => {
            // Mock database query error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValue(new Error('Database Error')),
                release: jest.fn()
            });

            const response = await request(app).delete('/movies/delete');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to delete old movies from the database: Database Error');
            console.log('DELETE /movies/delete error response:', response.body);
        });
    });
});
