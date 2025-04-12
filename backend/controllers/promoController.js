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

// Get Promo Code by Event ID
exports.getPromoByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch the promo code associated with the event
    const promo = await PromoCode.findOne({ event: eventId });

    if (!promo) {
      return res.status(404).json({ message: 'No promo code found for this event' });
    }

    res.json(promo);

  } catch (error) {
    console.error('Error fetching promo code:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
