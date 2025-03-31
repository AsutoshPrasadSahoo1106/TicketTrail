const Booking = require('../models/bookingModel.js');
const Event = require('../models/eventModel.js');


// Book a Ticket
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, totalPrice } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const booking = new Booking({ user: req.user.userId, event: eventId, ticketType, quantity, totalPrice });
    await booking.save();

    res.status(201).json({ message: 'Booking confirmed', booking });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
