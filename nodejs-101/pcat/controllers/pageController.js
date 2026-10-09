const Photo = require('../models/Photo');

exports.getAboutPage = (req, res) => {
  res.render('about');
};

exports.getAddPage = (req, res) => {
  res.render('add');
};

exports.getUpdatePage = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).render('error', {
        message: 'Photo not found.',
      });
    }
    res.render('edit', { photo });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Unable to load photo for editing.',
    });
  }
};
