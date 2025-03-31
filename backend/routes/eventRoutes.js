const express = require('express');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController.js');
const { authMiddleware, organizerMiddleware } = require('../middleware/authMiddleware.js');
const upload = require("../middleware/uploadMiddleware.js");


const router = express.Router();

router.post("/", authMiddleware, organizerMiddleware, upload.single("image"), createEvent);
router.get('/', getEvents); // Get all events (Public)
router.get('/:id', getEventById); // Get single event by ID
router.put("/:id", authMiddleware, organizerMiddleware, upload.single("image"), updateEvent);
router.delete('/:id', authMiddleware, organizerMiddleware, deleteEvent); // Delete event (Organizers only)

module.exports = router;
