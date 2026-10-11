const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    await User.create({ name, email, role, password });

    res.status(201).redirect('/login');
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        message: `A user with this ${field} already exists`,
        field,
      });
    }

    console.error(error);

    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          // USER SESSION
          req.session.userID = user._id;
          res.status(200).redirect('/dashboard');
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
