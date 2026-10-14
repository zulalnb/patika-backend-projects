const express = require('express');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router
  .route('/:id')
  .delete(roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;
