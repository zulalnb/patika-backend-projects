const User = require('../models/User');
const Category = require('../models/Category');

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById(req.session.userID);
  const categories = await Category.find();

  res.status(200).render('dashboard', { user, categories });
};
