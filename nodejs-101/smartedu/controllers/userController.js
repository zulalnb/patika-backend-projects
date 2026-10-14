const Course = require('../models/Course');
const User = require('../models/User');

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/dashboard');
    }

    if (user.role === 'teacher') {
      const courses = await Course.find({ user: user._id });
      const courseIds = courses.map((course) => course._id);

      if (courseIds.length > 0) {
        await User.updateMany(
          { courses: { $in: courseIds } },
          { $pull: { courses: { $in: courseIds } } }
        );

        await Course.deleteMany({ user: user._id });
      }
    }

    await User.findByIdAndDelete(user._id);

    req.flash('success', 'User deleted successfully.');
    return res.redirect('/dashboard');
  } catch (error) {
    return res.status(500).send('Server Error');
  }
};
