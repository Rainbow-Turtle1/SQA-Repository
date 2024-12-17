const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const blogRoutes = require('./routes/blog');

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
// Parse URL-encoded bodies (as sent by HTML forms)
// This middleware is needed to handle form submissions in our blog application
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// This middleware allows us to serve our CSS file and any other static assets
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', blogRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

