// Book a Ticket
const stripe = require("../config/stripe");
const Booking = require("../models/bookingModel.js");
const Event = require("../models/eventModel.js");
const PromoCode = require("../models/promoCodeModel.js");

exports.bookEvent = async (req, res) => {
  try {
    const { eventId, ticketType, quantity, promoCode } = req.body;

    // 1️⃣ Find the Event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2️⃣ Get Ticket Price
    const ticket = event.ticketTypes.find((t) => t.name === ticketType);
    if (!ticket) {
      return res.status(400).json({ message: "Invalid ticket type" });
    }
    const ticketPrice = ticket.price;

    let totalPrice = ticket.price;
    let discountAmount = 0;

    // 3️⃣ Apply Promo Code (if exists)
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode,
        event: eventId,
      });

      if (
        promo &&
        promo.usedCount < promo.maxUses &&
        new Date() <= new Date(promo.validUntil)
      ) {
        discountAmount =
          promo.discountType === "percentage"
            ? (totalPrice * promo.discountValue) / 100
            : promo.discountValue;
        totalPrice -= discountAmount;
        promo.usedCount += 1;
        await promo.save();
      }
    }

    // 4️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: `${event.title} - ${ticketType} Ticket`,
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity,
      }],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
      metadata: {
        userId: req.user.userId,
        eventId,
        ticketType,
        quantity,
        discountAmount,
      },
    });
    

    // 5️⃣ Send Checkout Session URL to Frontend
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate(
      "event"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// In bookingController.js
exports.confirmBooking = async (req, res) => {
  const { sessionId } = req.body;

  try {
    // Step 1: Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { userId, eventId, ticketType, quantity, discountAmount } = session.metadata;

    // Step 2: Atomically create booking if it doesn't exist
    const result = await Booking.findOneAndUpdate(
      { paymentId: sessionId },
      {
        $setOnInsert: {
          user: userId,
          event: eventId,
          ticketType,
          quantity: parseInt(quantity),
          totalPrice: session.amount_total / 100,
          discountAmount,
          status: "confirmed",
          paymentId: sessionId,
          bookingDate: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    // Step 3: If result existed before, return early
    const alreadyConfirmed = await Booking.countDocuments({ paymentId: sessionId }) > 1;
    if (alreadyConfirmed) {
      return res.status(200).json({ message: "Booking already confirmed." });
    }

    // Step 4: Update ticket quantity only if this is a new booking
    const event = await Event.findById(eventId);
    const ticket = event.ticketTypes.find((t) => t.name === ticketType);
    if (!ticket) return res.status(400).json({ message: "Invalid ticket type." });

    ticket.quantity -= parseInt(quantity);
    if (ticket.quantity < 0) ticket.quantity = 0; // prevent negative
    await event.save();

    res.status(200).json({ message: "Booking confirmed." });
  } catch (err) {
    console.error("Booking confirm error:", err);
    res.status(500).json({ message: "Failed to confirm booking." });
  }
};



