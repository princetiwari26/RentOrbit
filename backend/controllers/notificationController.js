const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

const getLandlordNotifications = asyncHandler(async (req, res) => {
    try {
        if (req.user.userType !== 'landlord') {
            res.status(403);
            throw new Error('Access denied, only landlords can view notifications');
        }

        const notifications = await Notification.find({ landlord: req.user.id, status: { $in: ['pending', 'tenant-cancelled', 'completed'] } })
            .sort({ createdAt: -1 });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        await Notification.updateMany(
            { landlord: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            message: 'Notifications retrieved successfully',
            notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Server error');
    }
});

const getTenantNotifications = asyncHandler(async (req, res) => {
    const { id, userType } = req.user;

    if (userType !== 'tenant') {
        return res.status(403).json({ message: "Access denied. Only tenants can view these notifications." });
    }

    try {
        const notifications = await Notification.find({ tenant: id, status: { $in: ['confirmed', 'landlord-cancelled'] } })
            .sort({ createdAt: -1 }) // Sort by latest
            .populate("room", "accommodation roomType address rent")
            .populate("landlord", "name email phone");

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch notifications." });
    }
});

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getLandlordNotifications,
    getTenantNotifications,
    deleteNotification
};