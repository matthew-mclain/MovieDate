const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/calendarRoutes');
const pool = require('../db');

// Mock database connection
jest.mock('../db');

app.use(express.json());
app.use('/calendar', router);

describe('Calendar Routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /calendar/add', () => {
        it('should add a movie to the user\'s calendar', async () => {
            // Mock database queries
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValueOnce({ rows: [{ exists: false }] }).mockResolvedValueOnce({ rows: [] }),
                release: jest.fn()
            });

            const response = await request(app)
                .post('/calendar/add')
                .send({ username: 'user', movieId: 1 });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Movie added to calendar successfully');
            console.log('POST /calendar/add response:', response.body);
        });

        it('should handle errors while fetching the calendar', async () => {
            // Mock database queries to simulate an error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
                release: jest.fn()
            });
    
            const response = await request(app)
                .get('/calendar')
                .query({ username: 'testuser', selectedFilters: [] });
    
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to fetch user\'s calendar');
            console.log('GET /calendar error response:', response.body);
        });
    });

    describe('GET /calendar', () => {
        it('should get the user\'s calendar with movies', async () => {
            // Mock database queries
            pool.connect.mockResolvedValue({
                query: jest.fn()
                    .mockResolvedValueOnce({ rows: [{ exists: true }] }) // User exists
                    .mockResolvedValueOnce({ rows: [{ user_id: 1 }] }) // Retrieve user ID
                    .mockResolvedValueOnce({ rows: [{ movie_id: 1 }] }) // User movies
                    .mockResolvedValueOnce({ rows: [{ movie_id: 1, title: 'Movie Title', release_date: '2024-08-01' }] }), // Movie details
                release: jest.fn()
            });
    
            const response = await request(app)
                .get('/calendar')
                .query({ username: 'testuser', selectedFilters: [] });
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ movie_id: 1, title: 'Movie Title', release_date: '2024-08-01' }]);
            console.log('GET /calendar response:', response.body);
        });
    
        it('should return 404 if user is not found', async () => {
            // Mock database queries
            pool.connect.mockResolvedValue({
                query: jest.fn()
                    .mockResolvedValueOnce({ rows: [{ exists: false }] }), // User does not exist
                release: jest.fn()
            });
    
            const response = await request(app)
                .get('/calendar')
                .query({ username: 'nonexistentuser', selectedFilters: [] });
    
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
            console.log('GET /calendar user not found response:', response.body);
        });
    
        it('should handle errors while fetching the calendar', async () => {
            // Mock database queries to simulate an error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
                release: jest.fn()
            });
    
            const response = await request(app)
                .get('/calendar')
                .query({ username: 'testuser', selectedFilters: [] });
    
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to fetch user\'s calendar');
            console.log('GET /calendar error response:', response.body);
        });
    });

    describe('DELETE /calendar/delete', () => {
        it('should delete a movie from the user\'s calendar', async () => {
            // Mock database queries
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValueOnce({ rowCount: 1 }), // Movie deleted successfully
                release: jest.fn()
            });
    
            const response = await request(app)
                .delete('/calendar/delete')
                .send({ username: 'user', movieId: 1 });
    
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Movie deleted from calendar successfully');
            console.log('DELETE /calendar/delete response:', response.body);
        });
    
        it('should handle errors while deleting a movie', async () => {
            // Mock database queries to simulate an error
            pool.connect.mockResolvedValue({
                query: jest.fn().mockRejectedValueOnce(new Error('Database Error')),
                release: jest.fn()
            });
    
            const response = await request(app)
                .delete('/calendar/delete')
                .send({ username: 'user', movieId: 1 });
    
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to delete movie from calendar');
            console.log('DELETE /calendar/delete error response:', response.body);
        });
    });    
});
