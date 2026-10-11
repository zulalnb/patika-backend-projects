const express = require('express');
var session = require('express-session');
const mongoose = require('mongoose');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const authRoute = require('./routes/authRoute');

const port = 3000;
const app = express();

// connect DB
mongoose.connect('mongodb://localhost/smartedu-test-db').then(() => {
  console.log('DB Connected!');
});

// Template engine
app.set('view engine', 'ejs');

// Global variable

global.userIN = null;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'session_id',
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use((req, res, next) => {
  userIN = req.session.userID;
  res.locals.currentPath = req.path;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/auth', authRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
