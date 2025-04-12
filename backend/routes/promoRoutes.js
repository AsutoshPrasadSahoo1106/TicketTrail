const express = require('express');
const { createPromoCode, validatePromoCode, getPromoByEvent } = require('../controllers/promoController.js');
const { authMiddleware, organizerMiddleware } = require('../middleware/authMiddleware.js');


const router = express.Router();

router.post('/', authMiddleware, organizerMiddleware, createPromoCode); // Create promo code (Organizers only)
router.post('/apply', authMiddleware, validatePromoCode); // Apply promo code
router.get('/event/:eventId', authMiddleware, getPromoByEvent);


module.exports = router;
