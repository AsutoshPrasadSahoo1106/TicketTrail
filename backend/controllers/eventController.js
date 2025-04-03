const Event = require('../models/eventModel');



// Create Event with Local Image Upload
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, location, ticketTypes } = req.body;

    // Check if event image is provided
    if (!req.file) {
      return res.status(400).json({ message: "Event image is required." });
    }

    // Get event image URL after upload
    const eventImageUrl = `/uploads/events/${req.file.filename}`;

    // Create new event
    const newEvent = new Event({
      title,
      description,
      category,
      date,
      time,
      venue,
      location,
      ticketTypes: JSON.parse(ticketTypes), // Parse ticketTypes if it's sent as string
      image: eventImageUrl,
      organizer: req.user.userId, // Organizer ID from JWT payload
    });

    // Save event to DB
    await newEvent.save();
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updatedEvent);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
