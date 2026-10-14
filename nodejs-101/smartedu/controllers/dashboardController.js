const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('courses');

    if (!user) {
      req.session.destroy(() => {
        res.redirect('/login');
      });
      return;
    }

    let categories = [];
    let courses = [];
    let users = [];

    switch (user.role) {
      case 'admin':
        categories = await Category.find();
        courses = await Course.find().sort({ createdAt: -1 });
        users = await User.find({ _id: { $ne: user._id } });
        break;

      case 'teacher':
        categories = await Category.find();
        courses = await Course.find({ user: user._id }).sort({ createdAt: -1 });
        break;

      case 'student':
        courses = user.courses;
        break;
    }

    res.render('dashboard', {
      user,
      categories,
      courses,
      users,
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
