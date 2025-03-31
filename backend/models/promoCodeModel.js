const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  maxUses: { type: Number },
  usedCount: { type: Number, default: 0 },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});

const PromoCode = mongoose.model('PromoCode', promoSchema);
module.exports = PromoCode;