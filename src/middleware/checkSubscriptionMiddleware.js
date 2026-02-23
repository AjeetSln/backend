const { sendResponse } = require('../utils/response');

const hasActiveProPlan = (user) => {
  if (!user || user.subscriptionPlan !== 'pro' || !user.planExpiry) return false;
  return new Date(user.planExpiry).getTime() > Date.now();
};

const checkSubscriptionMiddleware = (req, res, next) => {
  if (!hasActiveProPlan(req.user)) {
    return sendResponse(
      res,
      403,
      false,
      'Active Pro subscription is required for this action'
    );
  }
  next();
};

module.exports = { checkSubscriptionMiddleware, hasActiveProPlan };
