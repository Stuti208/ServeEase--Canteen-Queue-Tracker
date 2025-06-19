const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getMenu = async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
};

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  const { name, price, image } = req.body;
  const item = new MenuItem({ name, price, image });
  await item.save();
  res.json(item);
};

// Update a menu item (name, price, image)
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  const item = await MenuItem.findByIdAndUpdate(id, { name, price, image }, { new: true });
  res.json(item);
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  await MenuItem.findByIdAndDelete(id);
  res.json({ msg: 'Item deleted' });
};

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  const { id } = req.params;
  const item = await MenuItem.findById(id);
  if (!item) return res.status(404).json({ msg: 'Item not found' });
  item.available = !item.available;
  await item.save();
  res.json(item);
};