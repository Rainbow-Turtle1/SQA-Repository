const request = require('supertest');
const express = require('express');
const { sequelize } = require('../models');
const blogRoutes = require('../routes/blog');

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

// eslint-disable-next-line no-undef
describe('Blog Routes', () => {
    // eslint-disable-next-line no-undef
    test('GET HOME PAGE / Expect CODE 200', async () => {
        const response = await request(app).get('/')
        // eslint-disable-next-line no-undef
        expect(response.statusCode).toBe(200);
    })

    // test('POST BLOG /create', async ()=>{
    //     const newPost = {
    //         title: 'Test Post',
    //         content: 'This is a test',
    //         author: 'The Tester'
    //     }

    //     const response = await request(app)
    //         .post('/create')
    //         .send(newPost)
    //         // .expect(200)

    //     const foundPost = await BlogPost.findOne({ where: {title: newPost.title}});
    //     expect(post).not.toBeNull();
    //     expect(post.content).toBe(newPost.content)
    // })


})