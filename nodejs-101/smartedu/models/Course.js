const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please provide course name'],
      maxlength: [50, 'Name can not be more than 50 characters'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, 'Please provide course slug'],
      maxlength: [50, 'Slug can not be more than 50 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

CourseSchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
