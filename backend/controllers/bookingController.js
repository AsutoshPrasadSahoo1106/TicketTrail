// Book a Ticket
const stripe = require('../config/stripe'); 
const Booking = require('../models/bookingModel.js');
const Event = require('../models/eventModel.js');
const PromoCode = require('../models/promoCodeModel.js');

exports.bookEvent = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, promoCode, paymentMethodId } = req.body;

    // 1️⃣ Find the Event
    console.log("Event ID:", eventId);
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 2️⃣ Get Ticket Price
    console.log("Event Ticket Types:", event.ticketTypes);
    console.log("Provided Ticket Type:", ticketType);
    const ticket = event.ticketTypes.find(t => t.name === ticketType);
    console.log("Selected Ticket:", ticket);

    if (!ticket) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }
    const ticketPrice = ticket.price;

    let totalPrice = ticket.price * quantity;
    let discountAmount = 0;

    // 3️⃣ Apply Promo Code (if exists)
    let appliedPromoCode = null; // To store the applied promo code
    if (promoCode) {
      console.log("Promo Code:", promoCode);
      const promo = await PromoCode.findOne({ code: promoCode, event: eventId });
      console.log("Promo Code Details:", promo);

      if (promo && promo.usedCount < promo.maxUses && new Date() <= new Date(promo.validUntil)) {
        discountAmount = promo.discountType === 'percentage'
          ? (totalPrice * promo.discountValue) / 100
          : promo.discountValue;
        totalPrice -= discountAmount;
        promo.usedCount += 1;
        await promo.save();
        appliedPromoCode = promoCode; // Save the applied promo code
      }
    }

    // 4️⃣ Create Stripe Payment Intent (Amount in paise)
    console.log("Total Price:", totalPrice);
    console.log("Payment Method ID:", paymentMethodId);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe expects amount in paise
      currency: 'inr',
      payment_method_types: ['card'], // Allow both UPI and card payments
      payment_method: paymentMethodId,
      confirm: true, // Auto-confirm payment
    });

    // 5️⃣ Save Booking
    console.log("User ID:", req.user.userId);
    console.log("Booking Details:", {
      user: req.user.userId,
      event: eventId,
      ticketType,
      quantity,
      ticketPrice: ticket.price,
      totalPrice,
      discountAmount,
      promoCode: appliedPromoCode, // Include the promo code
      paymentId: paymentIntent.id,
    });

    const booking = new Booking({
      user: req.user.userId,
      event: eventId,
      ticketType,
      quantity,
      ticketPrice: ticket.price, // Add the ticket price here
      totalPrice,
      discountAmount,
      promoCode: appliedPromoCode, // Save the promo code
      paymentId: paymentIntent.id,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking confirmed', booking });

  } catch (error) {
    console.error('Booking Error:', error);
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
