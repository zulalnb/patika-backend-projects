const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const Photo = require('./models/Photo');

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

// Routes
app.get('/', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ dateCreated: -1 });
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
  try {
    const image = req.files?.image;

    if (!image) {
      return res.status(400).render('error', {
        message: 'Please upload an image.',
      });
    }

    const extension = path.extname(image.name);
    const basename = path.basename(image.name, extension);
    const filename = `${basename}-${crypto.randomUUID()}${extension}`;

    const uploadPath = path.join(__dirname, 'public', 'uploads', filename);

    await image.mv(uploadPath);

    const photo = await Photo.create({
      ...req.body,
      image: `/uploads/${filename}`,
    });

    res.redirect(`/photos/${photo._id}`);
  } catch (error) {
    console.error(error);

    res.status(500).render('error', {
      message: 'Unable to save photo.',
    });
  }
});

app.get('/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).render('error', {
        message: 'Photo not found.',
      });
    }
    res.render('photo', { photo });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Unable to load photo.',
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
