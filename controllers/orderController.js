const Order = require('../../models/orderModel');

const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
};

module.exports = { getPendingOrders };