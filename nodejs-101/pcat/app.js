const express = require('express');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Template engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
