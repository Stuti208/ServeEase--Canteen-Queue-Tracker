const express = require('express')
const router = express.Router()
const Feedback = require('../models/Feedback')
const { protect } = require('../middleware/authMiddleware')

// POST — submit feedback (logged-in users only)
router.post('/', protect, async (req, res) => {
    try {
        const { rating, category, message } = req.body
        if (!rating || !message) return res.status(400).json({ message: 'Rating and message are required' })

        const feedback = await Feedback.create({
            userId: req.user.id,
            userName: req.user.name,
            rating,
            category: category || 'other',
            message
        })
        res.status(201).json(feedback)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET — all feedback (admin only)
router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
        const feedbacks = await Feedback.find().sort({ createdAt: -1 })
        res.json(feedbacks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
