const request = require('supertest');
const express = require('express');
const { sequelize, User } = require('../models');
const userRoutes = require('../routes/user');

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('User Routes', () => {
    test('GET /register - should load the register page', async () => {
        const response = await request(app).get('/register');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Register');
    });
});