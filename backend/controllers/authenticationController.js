const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const dotenv = require("dotenv");
const upload = require("../middleware/uploadMiddleware.js"); // Import upload middleware

dotenv.config();



// Function to generate JWT Token
const generateToken = (user) => {
  
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    // Check for file upload errors
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { name, email, password, role, phone, address } = req.body;

    // Validate role
    if (!["user", "organizer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Choose 'user' or 'organizer'." });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
   


    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store profile picture if available
    let profilePictureUrl = "";
    if (req.file) {
      profilePictureUrl = `/uploads/users/${req.file.filename}`; // Local path of the image
    }

    // Create new user instance
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
      address: address || "",
      profilePicture: profilePictureUrl, // Save the image path
      wishlist: [],
      bookings: [],
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = generateToken(user);

    res.json({ message: "Login successful", token, user });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
