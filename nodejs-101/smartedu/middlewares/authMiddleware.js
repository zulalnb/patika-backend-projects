const User = require('../models/User');

module.exports = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (!user) return res.redirect('/login');
    })
    .catch(() => {
      return res.redirect('/login');
    });
  next();
};
