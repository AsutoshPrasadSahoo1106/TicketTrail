const mongoose = require("mongoose");
const PromoCode = require('../models/promoCodeModel.js');

// Create Promo Code
exports.createPromoCode = async (req, res) => {
  try {
    const { code, discountType, discountValue, validFrom, validUntil, maxUses, event } = req.body;

    const promo = new PromoCode({
      code, discountType, discountValue, validFrom, validUntil, maxUses, event,
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

    if (!code || !eventId) {
      return res.status(400).json({ message: 'Promo code and event ID are required' });
    }

    const promo = await PromoCode.findOne({ code });

    if (!promo) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }

    if (promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Promo code has reached its maximum usage limit' });
    }

    if (new Date(promo.validUntil) < new Date()) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    res.json({
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Promo Code by Event ID
exports.getPromoByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const promos = await PromoCode.find({ event: new mongoose.Types.ObjectId(eventId) });

    if (!promos || promos.length === 0) {
      return res.status(404).json({ message: 'No promo codes found for this event' });
    }

    res.json(promos);

  } catch (error) {
    console.error('Error fetching promo code:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
