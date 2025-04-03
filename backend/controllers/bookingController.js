const Booking = require('../models/bookingModel.js');
const Event = require('../models/eventModel.js');
const PromoCode = require('../models/promoCodeModel.js'); // 



// Book a Ticket
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, promoCode } = req.body;

    // 1️⃣ Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }


    // 2️⃣ Get ticket price
    const ticket = event.ticketTypes.find(t => t.name === ticketType);
    if (!ticket) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }


    const ticketPrice = ticket.price ;
    let totalPrice = ticketPrice * quantity;
    let discountAmount = 0;

    // 3️⃣ Apply Promo Code (if exists)
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode, event: eventId });

      if (!promo || promo.usedCount >= promo.maxUses || new Date() > new Date(promo.validUntil)) {
        console.log("Invalid or Expired Promo Code:", promo);
        return res.status(400).json({ message: 'Invalid or expired promo code' });
      }


      // Apply Discount
      discountAmount = promo.discountType === 'percentage'
        ? totalPrice * (promo.discountValue / 100)
        : promo.discountValue;

      totalPrice = Math.max(0, totalPrice - discountAmount);
      promo.usedCount += 1;
      await promo.save();
    }

    // 4️⃣ Save the Booking
    const booking = new Booking({
      user: req.user.userId,
      event: eventId,
      ticketType,
      quantity,
      ticketPrice,
      totalPrice,
      discountAmount,
      promoCode: promoCode || null,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking confirmed', booking });

  } catch (error) {
    console.error("Booking Error:", error);
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
