const Event = require('../models/eventModel');

// Create Event (Organizer Only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, location, ticketTypes } = req.body;
    
    if (!req.file) return res.status(400).json({ message: "Event image is required." });

    const result = await cloudinary.uploader.upload(req.file.path);

    
    const newEvent = new Event({
      title, description, category, date, time, venue, location, ticketTypes,eventImage: result.secure_url,
      organizer: req.user.userId
    });

    await newEvent.save();
    res.status(201).json(newEvent);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
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
