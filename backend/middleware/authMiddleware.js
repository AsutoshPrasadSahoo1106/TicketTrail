const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to verify authentication


exports.authMiddleware = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
}

if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to allow only organizers
exports.organizerMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Access denied. Organizers only' });
  }
  next();
};
