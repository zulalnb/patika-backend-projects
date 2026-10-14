const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    await User.create({ name, email, role, password });

    req.flash(
      'success',
      'Your account has been created successfully. You can now log in.'
    );
    return res.redirect('/login');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = validationResult(req);

      for (let i = 0; i < errors.array().length; i++) {
        req.flash('error', errors.array()[i].msg);
      }

      return res.status(400).redirect('/register');
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];

      req.flash('error', `A user with ${field} "${value}" already exists.`);
      return res.redirect('/register');
    }

    console.error(error);

    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.status(400).redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.status(400).redirect('/login');
    }

    req.session.userId = user._id;

    req.session.save((error) => {
      if (error) {
        console.error(error);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/login');
      }

      return res.status(200).redirect('/dashboard');
    });
  } catch (error) {
    console.error(error);

    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/login');
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
