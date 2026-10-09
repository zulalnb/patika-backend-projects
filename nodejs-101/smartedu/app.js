const express = require('express');
const mongoose = require('mongoose');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');

const port = 3000;
const app = express();

// connect DB
mongoose.connect('mongodb://localhost/smartedu-test-db').then(() => {
  console.log('DB Connected!');
});

// Template engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/', pageRoute);
app.use('/api/course', courseRoute);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
