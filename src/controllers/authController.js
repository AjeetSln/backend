const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { sendResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return sendResponse(res, 409, false, 'Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
    });

    const token = signToken({ id: user._id, role: user.role });
    return sendResponse(res, 201, true, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        planExpiry: user.planExpiry,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    const token = signToken({ id: user._id, role: user.role });
    return sendResponse(res, 200, true, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        planExpiry: user.planExpiry,
      },
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    return sendResponse(res, 200, true, 'Current user fetched', {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me };
