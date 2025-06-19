const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name')
    .populate('items.menuItem');
  res.json(orders);
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    .populate('user', 'name')
    .populate('items.menuItem');
  req.app.get('io').emit('orderStatusUpdated', order);
  res.json(order);
};

// User: Place a new order
exports.placeOrder = async (req, res) => {
  const { items } = req.body; // [{ menuItem, quantity }]
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'No items in order.' });
  }
  const order = new Order({
    user: req.user.id,
    items,
    status: 'in queue'
  });
  await order.save();
  req.app.get('io').emit('newOrder', order);
  res.json(order);
};

// User: Get their own orders
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.menuItem')
    .sort({ createdAt: -1 });
  res.json(orders);
};