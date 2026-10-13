const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById(req.session.userID);
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID }).sort({
    createdAt: -1,
  });

  res.status(200).render('dashboard', { user, categories, courses });
};
