const Category = require('../models/Category');
const Course = require('../models/Course');
const User = require('../models/User');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({ name });

    req.flash('success', `"${category.name}" category created successfully.`);
    return res.redirect('/dashboard');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);

      req.flash('error', errors);
      return res.redirect('/dashboard');
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      req.flash('error', `A category with this ${field} already exists.`);
      return res.redirect('/dashboard');
    }

    console.error(error);

    req.flash('error', 'Failed to create category. Please try again.');
    return res.redirect('/dashboard');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      req.flash('error', 'Category not found.');
      return res.redirect('/dashboard');
    }

    // Remove the deleted category reference from its courses.
    await Course.updateMany(
      { category: category._id },
      { $unset: { category: 1 } }
    );

    req.flash(
      'success',
      `"${category.name}" category has been deleted successfully.`
    );

    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);

    req.flash('error', 'Failed to delete category. Please try again.');
    return res.redirect('/dashboard');
  }
};
