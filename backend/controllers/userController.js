const User = require('../models/userModel.js');
const Event = require('../models/eventModel.js');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password').populate('wishlist').populate('bookings');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address, profilePicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { name, phone, address, profilePicture },
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.wishlist.includes(eventId)) {
            return res.status(400).json({ message: 'Event already in wishlist' });
        }

        user.wishlist.push(eventId);
        await user.save();

        res.status(200).json({ message: 'Event added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { eventId } = req.params;

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.wishlist = user.wishlist.filter(event => event.toString() !== eventId);
        await user.save();

        res.status(200).json({ message: 'Event removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
