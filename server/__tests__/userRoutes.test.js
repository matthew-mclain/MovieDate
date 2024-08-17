const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const pool = require('../db');
const bcrypt = require('bcrypt');

jest.mock('../db');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /users/signup', () => {
        it('should create a new user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({}),
                release: jest.fn(),
            });

            const response = await request(app)
                .post('/users/signup')
                .send({ email: 'test@example.com', username: 'testuser', password: 'password123' });

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/users/signup')
                .send({ email: 'test@example.com', username: 'testuser', password: 'password123' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to create user');
        });
    });

    describe('POST /users/signin', () => {
        it('should sign in a user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ username: 'testuser', password: await bcrypt.hash('password123', 10) }],
                }),
                release: jest.fn(),
            });

            const response = await request(app)
                .post('/users/signin')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Sign in successful');
        });

        it('should return 401 if the username is incorrect', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [] }),
                release: jest.fn(),
            });

            const response = await request(app)
                .post('/users/signin')
                .send({ username: 'wronguser', password: 'password123' });

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('Invalid username or password');
        });

        it('should return 401 if the password is incorrect', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ username: 'testuser', password: await bcrypt.hash('password123', 10) }],
                }),
                release: jest.fn(),
            });

            const response = await request(app)
                .post('/users/signin')
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('Invalid username or password');
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/users/signin')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to sign in');
        });
    });

    describe('POST /users/follow', () => {
        it('should follow a user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({}),
                release: jest.fn(),
            });

            const response = await request(app)
                .post('/users/follow')
                .send({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('User followed successfully');
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/users/follow')
                .send({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to follow user');
        });
    });

    describe('POST /users/unfollow', () => {
        it('should unfollow a user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({}),
                release: jest.fn(),
            });

            const response = await request(app)
                .post('/users/unfollow')
                .send({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('User unfollowed successfully');
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/users/unfollow')
                .send({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to unfollow user');
        });
    });

    describe('GET /users/following', () => {
        it('should return the list of users the current user is following', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ user_id: 1, username: 'frienduser' }],
                }),
                release: jest.fn(),
            });

            const response = await request(app)
                .get('/users/following')
                .query({ username: 'testuser' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([{ user_id: 1, username: 'frienduser' }]);
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/users/following')
                .query({ username: 'testuser' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to check following status');
        });
    });

    describe('GET /users/followers', () => {
        it('should return the list of users following the current user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ user_id: 1, username: 'followeruser' }],
                }),
                release: jest.fn(),
            });

            const response = await request(app)
                .get('/users/followers')
                .query({ username: 'testuser' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([{ user_id: 1, username: 'followeruser' }]);
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/users/followers')
                .query({ username: 'testuser' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to check followers status');
        });
    });

    describe('GET /users/is_following', () => {
        it('should return true if the current user is following the specified user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ exists: true }],
                }),
                release: jest.fn(),
            });

            const response = await request(app)
                .get('/users/is_following')
                .query({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toBe(true);
        });

        it('should return false if the current user is not following the specified user', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ exists: false }],
                }),
                release: jest.fn(),
            });

            const response = await request(app)
                .get('/users/is_following')
                .query({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toBe(false);
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/users/is_following')
                .query({ username: 'testuser', friendUsername: 'frienduser' });

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to check following status');
        });
    });

    describe('GET /users/:username', () => {
        it('should return user data if the user exists', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({
                    rows: [{ user_id: 1, username: 'testuser', email: 'test@example.com' }],
                }),
                release: jest.fn(),
            });

            const response = await request(app).get('/users/testuser');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ user_id: 1, username: 'testuser', email: 'test@example.com' });
        });

        it('should return 404 if the user does not exist', async () => {
            pool.connect.mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [] }),
                release: jest.fn(),
            });

            const response = await request(app).get('/users/nonexistentuser');

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        it('should return 500 if there is an error', async () => {
            pool.connect.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/users/testuser');

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Failed to get user');
        });
    });
});
