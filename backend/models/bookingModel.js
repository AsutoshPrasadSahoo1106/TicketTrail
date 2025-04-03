const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketType: { type: String, required: true },
  quantity: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },   // Final price after discount
  discountAmount: { type: Number, default: 0 },   // Amount discounted (if any)
  promoCode: { type: String, default: null },     // Applied promo code
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentId: { type: String },
  qrCode: { type: String },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;