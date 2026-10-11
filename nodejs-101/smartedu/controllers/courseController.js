const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = await Course.create({ name, description });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'A course with this name already exists',
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

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    console.log(courses);
    return res.status(200).render('courses', { courses });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
