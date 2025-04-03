const express = require("express");
const { register, login } = require("../controllers/authenticationController");
const { upload, setUploadType } = require("../middleware/uploadMiddleware"); // ✅ Import upload & setUploadType middleware

const router = express.Router();

// ✅ Apply setUploadType middleware to dynamically assign 'user' upload type
router.post(
  "/register",
  setUploadType("user"), // Set upload type for profile pictures
  (req, res, next) => {
    upload.single("profilePicture")(req, res, (err) => {
      if (err) {
        // Handle Multer errors gracefully
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ message: `File upload error: ${err.message}` });
        }
      }
      next();
    });
  },
  register
);

// User login (no image upload needed)
router.post("/login", login);

module.exports = router;
