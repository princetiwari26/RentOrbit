const express = require('express');
const { getLandlordNotifications, getTenantNotifications, deleteNotification} = require('../controllers/notificationController');
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.get('/landlord', protect, getLandlordNotifications);
router.get('/tenant', protect, getTenantNotifications);
// router.patch('/mark-as-read', protect, markAsRead);
router.delete('/delete/:notificationId', protect, deleteNotification);

module.exports = router;