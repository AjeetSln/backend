const Order = require('../models/Order');
const Product = require('../models/Product');
const Website = require('../models/Website');
const { createRazorpayOrder, verifyRazorpaySignature } = require('../services/razorpayService');
const { sendResponse } = require('../utils/response');

const createOrder = async (req, res, next) => {
  try {
    const { websiteId, productId, customerName, customerEmail } = req.body;

    const website = await Website.findById(websiteId);
    if (!website || !website.isPublished) {
      return sendResponse(res, 404, false, 'Website not found or unpublished');
    }

    const product = await Product.findOne({ _id: productId, websiteId });
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    const amount = Math.round(product.price * 100);

    const rzOrder = await createRazorpayOrder({
      amount,
      receipt: `product_${Date.now()}`,
      notes: { websiteId: String(websiteId), productId: String(productId) },
    });

    const order = await Order.create({
      websiteId,
      productId,
      customerName,
      customerEmail,
      amount: product.price,
      paymentStatus: 'pending',
      razorpayOrderId: rzOrder.id,
    });

    return sendResponse(res, 201, true, 'Order created', {
      order,
      razorpay: {
        orderId: rzOrder.id,
        amount: rzOrder.amount,
        currency: rzOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = 'failed';
      await order.save();
      return sendResponse(res, 400, false, 'Payment signature verification failed');
    }

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    return sendResponse(res, 200, true, 'Payment verified successfully', order);
  } catch (error) {
    next(error);
  }
};

const myOrders = async (req, res, next) => {
  try {
    const websites = await Website.find({ userId: req.user._id }).select('_id');
    const websiteIds = websites.map((w) => w._id);

    const orders = await Order.find({ websiteId: { $in: websiteIds } })
      .populate('productId', 'title price')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, myOrders };
