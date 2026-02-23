const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    plan: { type: String, enum: ['pro'], required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);
