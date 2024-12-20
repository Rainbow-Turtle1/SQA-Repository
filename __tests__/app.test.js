import request from 'supertest';
import { sequelize } from '../models';
import express from 'express';
import blogRoutes from '../routes/blog.js';

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use('/', blogRoutes);

// eslint-disable-next-line no-undef
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// eslint-disable-next-line no-undef
afterAll(async () => {
    await sequelize.close();
});

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const response = await request(app)
            .get('/').timeout({ deadline: 2000 }); 

        expect(response.status).toBe(200);
    });
});
