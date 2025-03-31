const Review = require('../models/reviewModel.js');

// Add a Review
exports.addReview = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    const review = new Review({
      user: req.user.userId,
      event: eventId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Reviews for an Event
exports.getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
