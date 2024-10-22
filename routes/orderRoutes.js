const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel'); // Ensure the path is correct
const CompletedOrder = require('../models/completedOrderModel');

// POST route to create a new order
router.post('/', async (req, res) => {
  try {
    console.log('Received order data:', req.body); // Log incoming request for debugging

    // Destructure the request body
    const { name, tableNo, mobileNo, paymentInfo, items, totalAmount, estimatedTime } = req.body;

    // Validate that all required fields are present
    if (!name || !tableNo || !mobileNo || !paymentInfo || !items || !totalAmount || !estimatedTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new order instance using the request data
    const newOrder = new Order({
      name,
      tableNo,
      mobileNo,
      paymentInfo,
      items,
      totalAmount,
      estimatedTime,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the saved order
    res.status(201).json(savedOrder);
  } catch (error) {
    // Log the full error details for troubleshooting
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order. Please try again.' });
  }
});

// GET route to retrieve all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders); // Respond with the list of orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders. Please try again.' });
  }
});

// POST route to complete an order
router.post('/:id/complete', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a completed order based on the pending order details
    const completedOrder = new CompletedOrder({
      name: order.name,
      tableNo: order.tableNo,
      mobileNo: order.mobileNo,
      paymentInfo: order.paymentInfo,
      items: order.items,
      totalAmount: order.totalAmount,
      estimatedTime: order.estimatedTime,
    });

    // Save the completed order to the database
    await completedOrder.save();

    // Delete the completed order from pending orders
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Order completed successfully', completedOrder });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: 'Failed to complete order' });
  }
});

// GET route to retrieve all completed orders
router.get('/completedOrders', async (req, res) => {
  try {
    const completedOrders = await CompletedOrder.find(); // Fetch all completed orders from the database
    res.status(200).json(completedOrders); // Respond with the list of completed orders
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ error: 'Failed to retrieve completed orders. Please try again.' });
  }
});

module.exports = router;
