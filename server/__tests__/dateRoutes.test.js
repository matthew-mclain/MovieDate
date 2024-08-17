const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/dateRoutes');
const pool = require('../db');

jest.mock('../db');

app.use(express.json());
app.use('/dates', router);

describe('Date Routes', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /dates/add', () => {
        it('should add a date to the user\'s dates', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
                      .mockResolvedValueOnce({ rows: [{ date_id: 1, date: '2024-08-01', time: '18:00:00', theater: 'Theater 1', invited_users: [] }] });

            const response = await request(app)
                .post('/dates/add')
                .send({ username: 'user', movieId: 1, date: '2024-08-01', time: '18:00:00', theater: 'Theater 1', invitedUsers: [] });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ date_id: 1, date: '2024-08-01', time: '18:00:00', theater: 'Theater 1', invited_users: [] });
        });

        it('should return 404 if user is not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .post('/dates/add')
                .send({ username: 'nonexistentuser', movieId: 1, date: '2024-08-01', time: '18:00:00', theater: 'Theater 1', invitedUsers: [] });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        it('should handle errors while adding a date', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database Error'));

            const response = await request(app)
                .post('/dates/add')
                .send({ username: 'user', movieId: 1, date: '2024-08-01', time: '18:00:00', theater: 'Theater 1', invitedUsers: [] });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to add date');
        });
    });

    describe('PUT /dates/edit', () => {
        it('should edit an existing date', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ date_id: 1, date: '2024-08-02', time: '19:00:00', theater: 'Theater 2', invited_users: [] }] });

            const response = await request(app)
                .put('/dates/edit')
                .send({ dateId: 1, date: '2024-08-02', time: '19:00:00', theater: 'Theater 2', invitedUsers: [] });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ date_id: 1, date: '2024-08-02', time: '19:00:00', theater: 'Theater 2', invited_users: [] });
        });

        it('should handle errors while editing a date', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database Error'));

            const response = await request(app)
                .put('/dates/edit')
                .send({ dateId: 1, date: '2024-08-02', time: '19:00:00', theater: 'Theater 2', invitedUsers: [] });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to update date');
        });
    });

    describe('DELETE /dates/delete', () => {
        it('should delete a date', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const response = await request(app)
                .delete('/dates/delete')
                .send({ dateId: 1 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Date deleted');
        });

        it('should handle errors while deleting a date', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database Error'));

            const response = await request(app)
                .delete('/dates/delete')
                .send({ dateId: 1 });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to delete date');
        });
    });

    describe('DELETE /dates/delete_old', () => {
        it('should delete old dates', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 1 });

            const response = await request(app)
                .delete('/dates/delete_old');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Old dates deleted');
        });

        it('should handle errors while deleting old dates', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database Error'));

            const response = await request(app)
                .delete('/dates/delete_old');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to delete old dates');
        });
    });
});
