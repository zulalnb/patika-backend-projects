const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

// Routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhotoById);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/:id/edit', pageController.getUpdatePage);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
