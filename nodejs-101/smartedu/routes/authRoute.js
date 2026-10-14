const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post(
  [
    body('name').not().isEmpty().withMessage('Please enter your name'),
    body('email')
      .isEmail()
      .withMessage('Please enter valid email.')
      .custom(async (userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject('Email already exists.');
          }
        });
      }),
    body('password').not().isEmpty().withMessage('Please enter a password.'),
  ],
  authController.createUser
);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);

module.exports = router;
