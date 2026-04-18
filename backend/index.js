require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const connectDB = require('./config/db')
const menuRoutes = require('./routes/menuRoutes')
const orderRoutes = require('./routes/orderRoutes')
const authRoutes = require('./routes/authRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const Order = require('./models/Order')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: { origin: '*' }
})

connectDB()

app.use(cors())
app.use(express.json())

// attach io to every request so routes can emit events
app.set('io', io)

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/feedback', feedbackRoutes)

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // client joins a room for each of their orders
    socket.on('join:order', (orderId) => {
        socket.join(`order:${orderId}`)
    })

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`)
    })
})

// reassignment job — runs every minute
const runReassignmentJob = () => {
    setInterval(async () => {
        try {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

            // find orders with items that have been 'ready' for over 10 minutes
            const expiredOrders = await Order.find({
                status: { $in: ['pending', 'partially_ready', 'ready'] },
                'items.status': 'ready',
                'items.readyAt': { $lt: tenMinutesAgo }
            })

            for (const order of expiredOrders) {
                for (const item of order.items) {
                    if (item.status !== 'ready' || !item.readyAt || item.readyAt > tenMinutesAgo) continue

                    // find another active order with the same menu item
                    const targetOrder = await Order.findOne({
                        _id: { $ne: order._id },
                        status: { $in: ['pending', 'partially_ready'] },
                        'items.menuItemId': item.menuItemId,
                        'items.status': { $in: ['pending', 'cooking'] }
                    })

                    // only reassign if a target order actually exists
                    if (!targetOrder) continue

                    const targetItem = targetOrder.items.find(i =>
                        i.menuItemId.toString() === item.menuItemId.toString() &&
                        ['pending', 'cooking'].includes(i.status)
                    )

                    if (!targetItem) continue

                    // mark original item as reassigned
                    item.status = 'reassigned'

                    // mark target item as ready
                    targetItem.status = 'ready'
                    targetItem.readyAt = new Date()

                    // recalculate target order status
                    const tStatuses = targetOrder.items.map(i => i.status)
                    if (tStatuses.every(s => s === 'picked_up')) targetOrder.status = 'completed'
                    else if (tStatuses.every(s => ['ready', 'picked_up'].includes(s))) targetOrder.status = 'ready'
                    else if (tStatuses.some(s => s === 'ready')) targetOrder.status = 'partially_ready'

                    await targetOrder.save()

                    // notify recipient
                    const minutesPassed = Math.floor((Date.now() - new Date(targetOrder.createdAt)) / 60000)
                    const savedTime = Math.max(0, targetOrder.estimatedTime - minutesPassed)
                    io.to(`order:${targetOrder._id}`).emit('order:item:received', {
                        order: targetOrder,
                        itemName: item.name,
                        savedTime
                    })

                    // recalculate original order status
                    const oStatuses = order.items.map(i => i.status)
                    const allGone = oStatuses.every(s => ['picked_up', 'reassigned'].includes(s))
                    const allReassigned = oStatuses.every(s => s === 'reassigned')
                    if (allReassigned) order.status = 'reassigned'
                    else if (allGone) order.status = 'completed'
                    else if (oStatuses.some(s => s === 'ready')) order.status = 'partially_ready'

                    await order.save()

                    // notify original user
                    io.to(`order:${order._id}`).emit('order:item:reassigned', {
                        order,
                        itemName: item.name
                    })
                }
            }
        } catch (err) {
            console.error('Reassignment job error:', err.message)
        }
    }, 60 * 1000)
}

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    runReassignmentJob()
})
