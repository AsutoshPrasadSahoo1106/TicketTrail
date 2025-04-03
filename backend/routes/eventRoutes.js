const express = require("express");
const multer = require('multer');

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController.js");
const {
  authMiddleware,
  organizerMiddleware,
} = require("../middleware/authMiddleware.js");
const { upload, setUploadType } = require("../middleware/uploadMiddleware.js"); // ✅ Import setUploadType

const router = express.Router();

// ✅ Create Event with image upload
router.post(
  "/",
  authMiddleware,
  organizerMiddleware,
  setUploadType("event"), // Dynamically set upload type for event images
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ message: `File upload error: ${err.message}` });
        }
      }
      next();
    });
  },
  createEvent
);

// ✅ Get all events (Public)
router.get("/", getEvents);

// ✅ Get a single event by ID (Public)
router.get("/:id", getEventById);

// ✅ Update Event with image upload
router.put(
  "/:id",
  authMiddleware,
  organizerMiddleware,
  setUploadType("event"), // Set upload type for event updates
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ message: `File upload error: ${err.message}` });
        }
      }
      next();
    });
  },
  updateEvent
);

// ✅ Delete event (Only for Organizers)
router.delete("/:id", authMiddleware, organizerMiddleware, deleteEvent);

module.exports = router;
