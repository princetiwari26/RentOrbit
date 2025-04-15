const express = require('express');
const { getLandlordNotifications, getTenantNotifications, deleteNotification, markNotificationAsRead, getUnreadNotificationCount} = require('../controllers/notificationController');
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.get('/landlord', protect, getLandlordNotifications);
router.get('/tenant', protect, getTenantNotifications);
router.put('/:notificationId/read', protect, markNotificationAsRead);
router.delete('/delete/:notificationId', protect, deleteNotification);
router.get('/unread/count', protect, getUnreadNotificationCount);

module.exports = router;