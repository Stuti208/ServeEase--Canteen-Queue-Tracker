const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public: Get menu
router.get('/', menuController.getMenu);

// Admin: Add, update, delete, toggle
router.post('/', auth, role('admin'), menuController.addMenuItem);
router.put('/:id', auth, role('admin'), menuController.updateMenuItem);
router.delete('/:id', auth, role('admin'), menuController.deleteMenuItem);
router.patch('/:id/toggle', auth, role('admin'), menuController.toggleAvailability);

module.exports = router;