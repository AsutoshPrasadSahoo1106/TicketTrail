const express = require('express');
const{bookEvent, getUserBookings, confirmBooking, getEventBookingStats} = require('../controllers/bookingController.js');
const {authMiddleware} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, bookEvent); // Book tickets

router.get('/', authMiddleware, getUserBookings); // Get user bookings

router.post("/confirm", authMiddleware, confirmBooking);

router.get("/stats/:eventId", authMiddleware, getEventBookingStats); // Get booking stats for an event

getEventBookingStats


module.exports = router;
