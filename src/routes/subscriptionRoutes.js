const express = require('express');
const {
  createSubscriptionOrder,
  verifySubscription,
} = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../utils/validators');

const router = express.Router();

router.post('/create-order', authMiddleware, createSubscriptionOrder);
router.post('/verify', authMiddleware, validate([
  { field: 'razorpayOrderId', required: true },
  { field: 'razorpayPaymentId', required: true },
  { field: 'razorpaySignature', required: true },
]), verifySubscription);

module.exports = router;
