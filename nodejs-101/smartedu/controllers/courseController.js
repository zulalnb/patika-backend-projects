const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    await Course.create({
      name,
      description,
      category,
      user: req.session.userId,
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
    const { category: categorySlug, search } = req.query;

    const categories = await Category.find();

    const category = await Category.findOne({
      slug: categorySlug,
    });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }

    if (search) {
      filter = { name: search };
    }

    if (!search && !categorySlug) {
      filter.name = '';
      filter.category = null;
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category },
      ],
    })
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
    const user = await User.findById(req.session.userId);
    const categories = await Category.find();

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res
      .status(200)
      .render('course-single', { user, categories, course });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.body.course_id;
    const user = await User.findById(req.session.userId);

    if (!user.courses.includes(courseId)) {
      user.courses.push({ _id: courseId });
      await user.save();
    }

    res.status(200).redirect('/dashboard');
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    await user.courses.pull({ _id: req.body.course_id });

    await user.save();

    res.status(200).redirect('/dashboard');
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
