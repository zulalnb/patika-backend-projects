const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide full name'],
    maxlength: [100, 'Name can not be more than 100 characters'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    maxlength: [100, 'Email can not be more than 100 characters'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
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

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
