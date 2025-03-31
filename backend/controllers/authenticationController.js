const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const dotenv = require("dotenv");
const upload = require("../middleware/uploadMiddleware.js"); // Import upload middleware
const cloudinary = require("../config/cloudinaryConfig.js"); // Import Cloudinary helper

dotenv.config();

// Function to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register User with Profile Picture Upload
exports.register = async (req, res) => {
  try {
    upload.single("profilePicture")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { name, email, password, role, phone, address } = req.body;

      if (!["user", "organizer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      
      let profilePictureUrl = "";
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        profilePictureUrl = result.secure_url;
      }

      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone: phone || "",
        address: address || "",
        profilePicture: profilePictureUrl,
        wishlist: [],
        bookings: [],
      });

      await user.save();

      // Generate JWT Token
      const token = generateToken(user);

      res.status(201).json({ message: "User registered successfully", token, user });
    });

  } catch (error) {
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
