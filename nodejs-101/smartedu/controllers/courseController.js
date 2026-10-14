const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const course = await Course.create({
      name,
      description,
      category,
      user: req.session.userId,
    });

    req.flash('success', `${course.name} has been created successfully`);
    return res.redirect('/courses');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);

      req.flash('error', errors);
      return res.redirect('/courses');
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];

      req.flash('error', `A course with ${field} "${value}" already exists.`);
      return res.redirect('/courses');
    }
    console.error(error);

    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/courses');
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

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      req.flash('error', 'Course not found.');
      return res.redirect('/dashboard');
    }

    await User.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    req.flash('success', `"${course.name}" has been deleted successfully.`);
    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);

    req.flash('error', 'Failed to delete course. Please try again.');
    return res.redirect('/dashboard');
  }
};