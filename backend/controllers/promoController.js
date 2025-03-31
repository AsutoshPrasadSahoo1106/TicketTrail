const PromoCode = require('../models/promoCodeModel.js');

// Create Promo Code
exports.createPromoCode = async (req, res) => {
  try {
    const { code, discountType, discountValue, validFrom, validUntil, maxUses, event } = req.body;

    const promo = new PromoCode({
      code, discountType, discountValue, validFrom, validUntil, maxUses, event
    });

    await promo.save();
    res.status(201).json({ message: 'Promo code created', promo });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Validate Promo Code
exports.validatePromoCode = async (req, res) => {
  try {
    const { code, eventId } = req.body;

    const promo = await PromoCode.findOne({ code, event: eventId });
    if (!promo || promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }

    res.json({ discountType: promo.discountType, discountValue: promo.discountValue });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
