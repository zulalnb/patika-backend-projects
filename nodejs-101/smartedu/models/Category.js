const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please provide category name'],
    maxlength: [50, 'Name can not be more than 50 characters'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'Please provide category slug'],
    maxlength: [50, 'Slug can not be more than 50 characters'],
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

CategorySchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
