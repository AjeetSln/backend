const User = require('../models/User');
const { sendResponse } = require('../utils/response');
const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Unauthorized: token missing');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendResponse(res, 401, false, 'Unauthorized: user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Unauthorized: invalid token');
  }
};

module.exports = authMiddleware;
