// models/orderModel.js
const mongoose = require('mongoose');

// Define the item schema (items within an order)
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  available: { type: Boolean, default: true },
  image: { type: String },
  amount: { type: Number, required: true } // Total amount for the item
});

// Define the order schema
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tableNo: { type: String, required: true },
  mobileNo: { type: String, required: true },
  paymentInfo: { 
    type: Object, 
    required: true 
  },
  items: [itemSchema], // Items is an array of itemSchema objects
  totalAmount: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'pending' 
  }
});

// Check if the Order model already exists before defining it
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;