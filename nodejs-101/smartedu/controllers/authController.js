const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    return res.status(201).json({ message: 'User created successfully', user });
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
