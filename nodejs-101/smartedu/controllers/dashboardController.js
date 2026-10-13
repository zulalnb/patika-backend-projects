const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById(req.session.userId).populate('courses');
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userId }).sort({
    createdAt: -1,
  });

  res.status(200).render('dashboard', { user, categories, courses });
};
