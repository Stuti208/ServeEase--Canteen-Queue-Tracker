const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, enum: ['food', 'service', 'app', 'other'], default: 'other' },
    message: { type: String, required: true, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
