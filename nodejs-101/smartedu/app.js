const express = require('express');
require('ejs');

const port = 3000;
const app = express();

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
app.get('/', (req, res) => {
  res.status(200).render('index');
});

app.get('/about', (req, res) => {
  res.status(200).render('about');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
