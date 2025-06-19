const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Admin: Get all orders, update status
router.get('/', auth, role('admin'), orderController.getAllOrders);
router.put('/:id/status', auth, role('admin'), orderController.updateOrderStatus);

// User: Place a new order
router.post('/', auth, role('user'), orderController.placeOrder);

// User: Get their own orders
router.get('/my', auth, role('user'), orderController.getUserOrders);

module.exports = router;