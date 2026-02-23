const express = require('express');
const { createOrder, verifyPayment, myOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../utils/validators');

const router = express.Router();

router.post('/create', validate([
  { field: 'websiteId', required: true },
  { field: 'productId', required: true },
  { field: 'customerName', required: true },
  { field: 'customerEmail', required: true, type: 'email' },
]), createOrder);

router.post('/verify-payment', validate([
  { field: 'razorpayOrderId', required: true },
  { field: 'razorpayPaymentId', required: true },
  { field: 'razorpaySignature', required: true },
]), verifyPayment);

router.get('/my-orders', authMiddleware, myOrders);

module.exports = router;
