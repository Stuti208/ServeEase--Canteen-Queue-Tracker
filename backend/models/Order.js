const mongoose = require('mongoose')

// schema for each item inside an order
const orderItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    prepTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'cooking', 'ready', 'picked_up', 'reassigned'],
        default: 'pending'
    },
    readyAt: {
        type: Date,
        default: null    // set when admin marks this item as ready
    }
})

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        default: 'Walk-in'
    },
    source: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
    },
    socketId: {
        type: String,
        default: null    // set when user connects via Socket.io
    },
    queueNumber: {
        type: Number
    },
    estimatedTime: {
        type: Number     // in minutes, calculated at order creation
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'partially_ready', 'ready', 'completed', 'cancelled', 'reassigned'],
        default: 'pending'
    },
    items: [orderItemSchema]

}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
