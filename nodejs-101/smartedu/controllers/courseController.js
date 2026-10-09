const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = await Course.create({ name, description });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};
