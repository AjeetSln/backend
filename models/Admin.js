const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving
adminSchema.pre('save', async function (next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
