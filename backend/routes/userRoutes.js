const express = require('express');
const { getUserProfile, updateUserProfile, addToWishlist, removeFromWishlist } = require('../controllers/userController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');


const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile); // Get user profile
router.put('/profile', authMiddleware, updateUserProfile); // Update user profile
router.post('/wishlist/:eventId', authMiddleware, addToWishlist); // Add event to wishlist
router.delete('/wishlist/:eventId', authMiddleware, removeFromWishlist); // Remove event from wishlist

module.exports = router;
