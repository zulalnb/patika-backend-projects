const express = require('express');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const flash = require('connect-flash');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const authRoute = require('./routes/authRoute');

dotenv.config();

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
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.use(
  session({
    secret: process.env.SECRET_TOKEN,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/smartedu-test-db',
    }),
  })
);

app.use(flash());

// Global template variables
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.flashMessages = req.flash();
  res.locals.userIN = !!req.session.userId;
  next();
});

// Routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/auth', authRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
