const Photo = require('../models/Photo');
const path = require('path');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalPhotos = await Photo.countDocuments();
    const totalPages = Math.ceil(totalPhotos / limit);

    const photos = await Photo.find()
      .sort({ dateCreated: -1 })
      .skip(skip)
      .limit(limit);

    res.render('index', {
      photos,
      currentPage: page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Unable to load photos.',
    });
  }
};

exports.getPhotoById = async (req, res) => {
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
};

exports.createPhoto = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.files?.image;

    if (!image) {
      return res.status(400).render('error', {
        message: 'Please upload an image.',
      });
    }

    const extension = path.extname(image.name);
    const basename = path.basename(image.name, extension);
    const filename = `${basename}-${crypto.randomUUID()}${extension}`;

    const uploadPath = path.join(
      __dirname,
      '..',
      'public',
      'uploads',
      filename
    );

    await image.mv(uploadPath);

    const photo = await Photo.create({
      title,
      description,
      image: `/uploads/${filename}`,
    });

    res.redirect(`/photos/${photo._id}`);
  } catch (error) {
    console.error(error);

    res.status(500).render('error', {
      message: 'Unable to save photo.',
    });
  }
};

exports.updatePhoto = async (req, res) => {
  const { title, description } = req.body;
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        dateUpdated: Date.now(),
      },
      {
        returnDocument: 'after',
      }
    );
    if (!photo) {
      return res.status(404).render('error', {
        message: 'Photo not found.',
      });
    }
    res.redirect(`/photos/${photo._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Unable to update photo.',
    });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).render('error', {
        message: 'Photo not found.',
      });
    }

    const imagePath = path.join(__dirname, '..', 'public', photo.image);

    fs.unlinkSync(imagePath);

    await Photo.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Unable to delete photo.',
    });
  }
};
