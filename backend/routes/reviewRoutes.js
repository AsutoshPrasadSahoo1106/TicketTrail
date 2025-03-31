const express = require('express');
const { addReview, getEventReviews } = require('../controllers/reviewController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');


const router = express.Router();

router.post('/:eventId', authMiddleware, addReview); // Add a review
router.get('/:eventId', getEventReviews); // Get all reviews for an event

module.exports = router;
