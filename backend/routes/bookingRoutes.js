const express = require('express');
const{bookEvent, getUserBookings, finalizeBooking} = require('../controllers/bookingController.js');
const {authMiddleware} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, bookEvent); // Book tickets

router.get('/', authMiddleware, getUserBookings); // Get user bookings

module.exports = router;
