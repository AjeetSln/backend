const { sendResponse } = require('../utils/response');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return sendResponse(res, 400, false, 'Validation failed', err.message);
  }

  if (err.code === 11000) {
    return sendResponse(res, 409, false, 'Duplicate key error', err.keyValue);
  }

  return sendResponse(res, err.statusCode || 500, false, err.message || 'Internal server error');
};

module.exports = errorHandlerMiddleware;
