# Testing the Blog Application

This document provides step-by-step instructions for setting up and running tests for the blog application. It also includes guidance on configuring GitHub Actions to automatically run these tests on any branch. This guide is designed for beginners who are new to npm, Node.js, and testing.

## 1. Setting Up Jest

First, you need to install Jest and Supertest as development dependencies. Open your terminal and run the following command:

```sh
npm install --save-dev jest supertest
```

Next, update the `package.json` file to include a test script. This script will allow you to run your tests easily. Add the following lines to the `scripts` section of your `package.json` file:

```json
"scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
}
```

## 2. Writing Tests

Create a test file in the `__tests__` directory. For example, you can create a file named `app.test.js` with the following content:

```javascript
const request = require('supertest');
const express = require('express');
const { sequelize, BlogPost } = require('../models');
const blogRoutes = require('../routes/blog');

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use('/', blogRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Blog Routes', () => {
    test('GET HOME PAGE / Expect CODE 200', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200);
    });

    test('POST BLOG /create', async () => {
        const newPost = {
            title: 'Test Post',
            content: 'This is a test',
            author: 'The Tester'
        };

        const response = await request(app)
            .post('/create')
            .send(newPost);

        const foundPost = await BlogPost.findOne({ where: { title: newPost.title } });
        expect(foundPost).not.toBeNull();
        expect(foundPost.content).toBe(newPost.content);
    });
});
```

## 3. Running Tests Locally

To run the tests locally, open your terminal and use the following command:

```sh
npm test
```

This command will execute the test script you added to your `package.json` file.

## 4. Setting Up GitHub Actions

GitHub Actions allows you to automate the process of running tests on your code. Follow these steps to set it up:

### 4.1 Creating the Workflow File

Create a GitHub Actions workflow file in `.github/workflows/node.js.yml` with the following content. This file will configure GitHub Actions to run the tests on any branch whenever you push code or create a pull request:

```yaml
name: Blog App Functionality Tests

on:
    push:
        branches: ["*"]
    pull_request:
        branches: ["*"]
```
### 4.2 Defining the Job
Define the job to run the tests by adding the following content to your workflow file:
```yaml
jobs:
    test:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v3
        - name: Use Node.js v20.x
            uses: actions/setup-node@v3
            with:
                node-version: 20.x
                cache: 'npm'
        - run: npm ci
        - run: touch database.sqlite
        - run: npm test
```
This workflow will automatically run the tests on every push and pull request to any branch, ensuring your code is always tested.