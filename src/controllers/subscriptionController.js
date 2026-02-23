const SubscriptionPayment = require('../models/SubscriptionPayment');
const User = require('../models/User');
const { createRazorpayOrder, verifyRazorpaySignature } = require('../services/razorpayService');
const { sendResponse } = require('../utils/response');

const PRO_PLAN_PRICE = 99;

const createSubscriptionOrder = async (req, res, next) => {
  try {
    const amountInPaise = PRO_PLAN_PRICE * 100;
    const rzOrder = await createRazorpayOrder({
      amount: amountInPaise,
      receipt: `sub_${req.user._id}_${Date.now()}`,
      notes: { userId: String(req.user._id), plan: 'pro' },
    });

    const payment = await SubscriptionPayment.create({
      userId: req.user._id,
      amount: PRO_PLAN_PRICE,
      plan: 'pro',
      razorpayOrderId: rzOrder.id,
      status: 'created',
    });

    return sendResponse(res, 201, true, 'Subscription order created', {
      payment,
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

const verifySubscription = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const payment = await SubscriptionPayment.findOne({ razorpayOrderId });
    if (!payment) {
      return sendResponse(res, 404, false, 'Subscription order not found');
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      payment.status = 'failed';
      await payment.save();
      return sendResponse(res, 400, false, 'Signature verification failed');
    }

    payment.status = 'paid';
    payment.razorpayPaymentId = razorpayPaymentId;
    await payment.save();

    const user = await User.findById(payment.userId);
    const currentExpiry = user.planExpiry && new Date(user.planExpiry).getTime() > Date.now()
      ? new Date(user.planExpiry)
      : new Date();
    currentExpiry.setDate(currentExpiry.getDate() + 30);

    user.subscriptionPlan = 'pro';
    user.planExpiry = currentExpiry;
    await user.save();

    return sendResponse(res, 200, true, 'Subscription activated successfully', {
      subscriptionPlan: user.subscriptionPlan,
      planExpiry: user.planExpiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubscriptionOrder, verifySubscription };
