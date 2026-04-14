const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'drinks', 'snacks']
    },
    image: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const MenuItem = mongoose.model('MenuItem', menuItemSchema)

module.exports = MenuItem
