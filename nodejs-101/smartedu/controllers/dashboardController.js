const User = require('../models/User');

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById(req.session.userID);

  res.status(200).render('dashboard', { user });
};
