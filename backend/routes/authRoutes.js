const express = require("express");
const { register, login } = require("../controllers/authenticationController");
const upload = require("../middleware/uploadMiddleware"); // ✅ Import upload middleware

const router = express.Router();

// Use upload middleware for profile picture upload during registration
router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login); // User login

module.exports = router;
