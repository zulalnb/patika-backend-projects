const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const Photo = require('./models/Photo');

const port = 3000;
const app = express();

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');

// Template engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.render('index', { photos });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Unable to load photos.',
    });
  }
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
