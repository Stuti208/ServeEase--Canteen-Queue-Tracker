const Feedback = require('../models/Feedback');

// User: Submit feedback
exports.submitFeedback = async (req, res) => {
  const { order, rating, comment } = req.body;
  if (!order || !rating) return res.status(400).json({ msg: 'Order and rating required.' });
  const feedback = new Feedback({
    user: req.user.id,
    order,
    rating,
    comment
  });
  await feedback.save();
  res.json(feedback);
};

// Admin: Get all feedback
exports.getAllFeedback = async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate('user', 'name')
    .populate('order');
  res.json(feedbacks);
};

// User: Get their own feedback
exports.getUserFeedback = async (req, res) => {
  const feedbacks = await Feedback.find({ user: req.user.id })
    .populate('order');
  res.json(feedbacks);
};