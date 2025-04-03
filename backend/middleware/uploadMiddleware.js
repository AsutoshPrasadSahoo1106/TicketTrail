const multer = require("multer");
const path = require("path");

// Allowed file types for images
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "uploads/";

    // Check if upload type is specified in request
    if (req.uploadType === "user") {
      uploadFolder += "users/"; // Store user profile pictures
    } else if (req.uploadType === "event") {
      uploadFolder += "events/"; // Store event pictures
    } else {
      return cb(new Error("Invalid upload type. Use 'user' or 'event'."), false);
    }

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Clean file name and add timestamp to prevent duplication
    const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;
    cb(null, fileName);
  },
});

// File Type Validation
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, and JPEG formats are allowed."
      ),
      false
    );
  }
};

// Multer configuration with 2MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
});

// Middleware to set upload type dynamically
const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type; // Set upload type dynamically
  next();
};

module.exports = { upload, setUploadType };
