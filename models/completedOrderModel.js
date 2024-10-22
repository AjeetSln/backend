const mongoose = require('mongoose');

const completedOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tableNo: { type: Number, required: true },
  mobileNo: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  items: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      amount: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('CompletedOrder', completedOrderSchema);
