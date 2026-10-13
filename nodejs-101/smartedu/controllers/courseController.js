const Course = require('../models/Course');
const Category = require('../models/Category');

exports.createCourse = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    await Course.create({
      name,
      description,
      category,
      user: req.session.userID,
    });

    return res.status(201).redirect('/courses');
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
    const { category: categorySlug } = req.query;

    const categories = await Category.find();

    const category = await Category.findOne({
      slug: categorySlug,
    });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .populate('user');
    return res.status(200).render('courses', { courses, categories });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).populate('user');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).render('course-single', { course });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
