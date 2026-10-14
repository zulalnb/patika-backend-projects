const express = require('express');
const categoryController = require('../controllers/categoryController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router
  .route('/')
  .post(roleMiddleware(['admin']), categoryController.createCategory);
router
  .route('/:id')
  .delete(roleMiddleware(['admin']), categoryController.deleteCategory);

module.exports = router;
