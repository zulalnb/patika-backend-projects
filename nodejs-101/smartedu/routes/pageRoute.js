const express = require('express');
const pageController = require('../controllers/pageController');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.route('/').get(pageController.getHomePage);
router.route('/about').get(pageController.getAboutPage);
router.route('/register').get(pageController.getRegisterPage);
router.route('/login').get(pageController.getLoginPage);
router.route('/dashboard').get(dashboardController.getDashboardPage);

module.exports = router;
