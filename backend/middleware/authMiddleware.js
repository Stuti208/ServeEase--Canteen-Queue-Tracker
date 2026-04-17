const jwt = require('jsonwebtoken')

// protect — blocks request if no valid token
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' })

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}

// optionalAuth — attaches user if token present, continues either way
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET)
        } catch {}
    }
    next()
}

module.exports = { protect, optionalAuth }
