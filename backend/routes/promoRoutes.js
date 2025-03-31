const express = require('express');
const { createPromoCode, validatePromoCode } = require('../controllers/promoController.js');
const { authMiddleware, organizerMiddleware } = require('../middleware/authMiddleware.js');


const router = express.Router();

router.post('/', authMiddleware, organizerMiddleware, createPromoCode); // Create promo code (Organizers only)
router.post('/apply', authMiddleware, validatePromoCode); // Apply promo code

module.exports = router;
