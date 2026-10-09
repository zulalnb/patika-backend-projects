const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please provide course name'],
    maxlength: [50, 'Name can not be more than 50 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide course description'],
    maxlength: [500, 'Description can not be more than 500 characters'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
