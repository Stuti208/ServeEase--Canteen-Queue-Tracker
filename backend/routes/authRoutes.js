const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (user) => jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
)

// POST — register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, studentIdImage } = req.body

        const exists = await User.findOne({ email })
        if (exists) return res.status(400).json({ message: 'Email already registered' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword, studentIdImage })

        res.status(201).json({
            token: generateToken(user),
            user: { id: user._id, name: user.name, role: user.role }
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// POST — login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid email or password' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' })

        res.status(200).json({
            token: generateToken(user),
            user: { id: user._id, name: user.name, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
