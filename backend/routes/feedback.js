const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// User: Submit feedback, get their feedback
router.post('/', auth, role('user'), feedbackController.submitFeedback);
router.get('/my', auth, role('user'), feedbackController.getUserFeedback);

// Admin: Get all feedback
router.get('/', auth, role('admin'), feedbackController.getAllFeedback);

module.exports = router;