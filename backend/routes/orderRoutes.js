const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const MenuItem = require('../models/MenuItem')
const { protect, optionalAuth } = require('../middleware/authMiddleware')

// helper — calculates estimated time for a new order
// logic: for each item, count how many of the same item exist
// in active orders ahead, then multiply by prepTime
const calculateEstimatedTime = async (items) => {
    let maxETA = 0

    for (const item of items) {
        // count how many of this item are in active (non-completed) orders
        const activeOrders = await Order.find({
            status: { $in: ['pending', 'partially_ready'] },
            'items.menuItemId': item.menuItemId,
            'items.status': { $in: ['pending', 'cooking'] }
        })
    

        const itemsAhead = activeOrders.reduce((count, order) => {
            const match = order.items.find(i =>
                i.menuItemId.toString() === item.menuItemId.toString() &&
                ['pending', 'cooking'].includes(i.status)
            )
            return match ? count + match.quantity : count
        }, 0) 

        // ETA for this item = base prepTime + (items ahead × prepTime)
        const itemETA = item.prepTime + (itemsAhead * item.prepTime)
        if (itemETA > maxETA) maxETA = itemETA
    }

    return maxETA
}

// POST — place a new order (online or offline)
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { customerName, items, source } = req.body

        // check all items are still available
        const menuItemIds = items.map(i => i.menuItemId)
        const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } })
        const unavailable = menuItems.filter(m => !m.isAvailable).map(m => m.name)
        if (unavailable.length > 0) {
            return res.status(400).json({
                message: `Some items are no longer available: ${unavailable.join(', ')}`
            })
        }

        // get the latest queue number
        const lastOrder = await Order.findOne().sort({ queueNumber: -1 })
        const queueNumber = lastOrder ? lastOrder.queueNumber + 1 : 1

        // calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        // calculate estimated time based on queue
        const estimatedTime = await calculateEstimatedTime(items)

        const newOrder = new Order({
            userId: req.user?.id || null,
            customerName: req.user?.name || customerName || 'Walk-in',
            source: source || 'online',
            queueNumber,
            estimatedTime,
            totalAmount,
            items
        })

        const savedOrder = await newOrder.save()
        res.status(201).json(savedOrder)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// PATCH — cancel an order (admin)
router.patch('/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        if (order.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed order' })
        }

        order.status = 'cancelled'
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PATCH — update a single item's status (admin)
router.patch('/:orderId/items/:itemId/status', async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['pending', 'cooking', 'ready', 'picked_up']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid item status' })
        }

        const order = await Order.findById(req.params.orderId)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        const item = order.items.id(req.params.itemId)
        if (!item) return res.status(404).json({ message: 'Item not found' })

        item.status = status
        if (status === 'ready') item.readyAt = new Date()

        // auto-recalculate order status from item statuses
        const statuses = order.items.map(i => i.status)
        const allPickedUp = statuses.every(s => s === 'picked_up')
        const allReady = statuses.every(s => ['ready', 'picked_up'].includes(s))
        const someReady = statuses.some(s => s === 'ready')

        if (allPickedUp) order.status = 'completed'
        else if (allReady) order.status = 'ready'
        else if (someReady) order.status = 'partially_ready'
        else order.status = 'pending'

        const updatedOrder = await order.save()

        // emit only to the room for this specific order
        const io = req.app.get('io')
        io.to(`order:${updatedOrder._id}`).emit('order:updated', updatedOrder)

        res.status(200).json(updatedOrder)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET — dashboard stats (admin)
router.get('/stats', async (req, res) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [todayOrders, activeOrders, menuItems, feedbackCount, last7DaysOrders] = await Promise.all([
            Order.find({ createdAt: { $gte: today } }),
            Order.find({ status: { $in: ['pending', 'partially_ready', 'ready'] } }),
            require('../models/MenuItem').countDocuments({ isAvailable: true }),
            require('../models/Feedback').countDocuments(),
            Order.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
        ])

        const revenue = todayOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.totalAmount, 0)

        const statusCounts = todayOrders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1
            return acc
        }, {})

        // Hourly breakdown for today (orders per hour 8am–9pm)
        const hourlyData = Array.from({ length: 14 }, (_, i) => {
            const hour = i + 8
            const count = todayOrders.filter(o => new Date(o.createdAt).getHours() === hour).length
            const rev = todayOrders
                .filter(o => new Date(o.createdAt).getHours() === hour && o.status !== 'cancelled')
                .reduce((s, o) => s + o.totalAmount, 0)
            return { hour: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`, orders: count, revenue: rev }
        })

        // Last 7 days daily breakdown
        const dailyData = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            d.setHours(0, 0, 0, 0)
            const next = new Date(d); next.setDate(next.getDate() + 1)
            const dayOrders = last7DaysOrders.filter(o => {
                const t = new Date(o.createdAt)
                return t >= d && t < next
            })
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            return {
                day: days[d.getDay()],
                orders: dayOrders.length,
                revenue: dayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0)
            }
        })

        // Top items today
        const itemMap = {}
        todayOrders.forEach(o => o.items.forEach(it => {
            itemMap[it.name] = (itemMap[it.name] || 0) + it.quantity
        }))
        const topItems = Object.entries(itemMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, qty]) => ({ name, qty }))

        res.json({
            today: {
                total: todayOrders.length,
                pending: statusCounts.pending || 0,
                cooking: todayOrders.filter(o => o.items.some(i => i.status === 'cooking')).length,
                ready: statusCounts.ready || 0,
                completed: statusCounts.completed || 0,
                cancelled: statusCounts.cancelled || 0,
                revenue
            },
            active: activeOrders.length,
            menuItems,
            feedbackCount,
            hourlyData,
            dailyData,
            topItems,
            recentOrders: await Order.find().sort({ createdAt: -1 }).limit(6)
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET — all orders (admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET — orders by userId (used after auth)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' })
        }
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// GET — orders by customer name (user)
router.get('/:customerName', async (req, res) => {
    try {
        const orders = await Order.find({
            customerName: { $regex: new RegExp(`^${req.params.customerName}$`, 'i') }
        }).sort({ createdAt: -1 })

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
