const Catgory = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Catgory.create({ name });

    res
      .status(201)
      .json({ message: 'Category created successfully', category });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'A category with this name already exists',
        field: Object.keys(error.keyValue)[0],
        value: Object.values(error.keyValue)[0],
      });
    }

    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
