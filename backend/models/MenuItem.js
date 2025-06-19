const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String }, // URL or filename for the item's image
});

module.exports = mongoose.model('MenuItem', menuItemSchema);