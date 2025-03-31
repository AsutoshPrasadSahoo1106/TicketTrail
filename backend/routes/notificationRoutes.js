const express = require('express');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');


const router = express.Router();

router.get('/', authMiddleware, getUserNotifications); // Get user notifications
router.put('/:id', authMiddleware, markAsRead); // Mark notification as read

module.exports = router;
