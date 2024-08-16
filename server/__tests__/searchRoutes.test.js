const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/searchRoutes');
const pool = require('../db');

// Mock database connection
jest.mock('../db');

app.use(express.json());
app.use('/search', router);

describe('Search Routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /search', () => {
        it('should search for movies and users based on query', async () => {
            // Mock database queries
            pool.connect.mockResolvedValue({
                query: jest.fn()
                    .mockResolvedValueOnce({ rows: [{ movie_id: 1, title: 'Interstellar' }] }) // Movies result
                    .mockResolvedValueOnce({ rows: [{ user_id: 1, username: 'chrisnolan' }] }), // Users result
                release: jest.fn()
            });

            const response = await request(app)
                .get('/search')
                .query({ query: 'in' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                movies: [{ movie_id: 1, title: 'Interstellar' }],
                users: [{ user_id: 1, username: 'chrisnolan' }]
            });
            console.log('GET /search response:', response.body);
        });

        it('should handle errors during the search', async () => {
            // Mock database queries to simulate an error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
                release: jest.fn()
            });

            const response = await request(app)
                .get('/search')
                .query({ query: 'test' });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to search');
            console.log('GET /search error response:', response.body);
        });
    });
});
