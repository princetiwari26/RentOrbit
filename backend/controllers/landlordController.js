const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const Landlord = require('../models/Landlord');
const generateToken = require('../utils/generateToken')
const Room = require('../models/Room');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');
const Request = require('../models/Request');

const registerLandlord = async (req, res) => {
    const { name, email, phone, address, password } = req.body;
    try {
        const existingLandlord = await Landlord.findOne({ email });
        if (existingLandlord) {
            return res.status(400).json({ message: "Landlord alredy exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const landlord = await Landlord.create({ name, email, phone, address, password: hashedPassword });

        if (landlord) {
            res.status(201).json({
                _id: landlord._id,
                name: landlord.name,
                token: generateToken(landlord._id),
            });
        } else {
            res.status(400).json({ message: "Invalid landlord data" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const loginLandlord = async (req, res) => {
    const { email, password } = req.body;
    try {
        const landlord = await Landlord.findOne({ email });
        if (landlord && (await bcrypt.compare(password, landlord.password))) {
            res.json({
                name: landlord.name,
                token: generateToken(landlord._id, "landlord"),
            })
        } else {
            res.status(401).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLandlordProfile = asyncHandler(async (req, res) => {
    if (req.user.userType !== "landlord") {
        return res.status(403).json({ message: "Unauthorized action for landlord" });
    }

    const landlord = await Landlord.findById(req.user.id).select("-password");

    if (!landlord) {
        return res.status(404).json({ message: "Landlord profile not found" });
    }

    res.status(200).json(landlord);
});

const getLandlordDashboardStats = async (req, res) => {
  try {
    const landlordId = req.user.id;

    if (req.user.userType !== 'landlord') {
      return res.status(403).json({ message: 'Access denied. Only landlords can access this data.' });
    }

    const [
      totalRooms,
      activeRooms,
      inactiveRooms,
      occupiedRooms,
      readNotifications,
      unreadNotifications,
      totalRequests,
      roomRequests,
      maintenanceRequests,
      maintenancePending,
      maintenanceInProgress,
      maintenanceResolved,
      maintenanceCancelled
    ] = await Promise.all([
      Room.countDocuments({ landlord: landlordId }),
      Room.countDocuments({ landlord: landlordId, roomStatus: 'Active' }),
      Room.countDocuments({ landlord: landlordId, roomStatus: 'Inactive' }),
      Room.countDocuments({ landlord: landlordId, tenant: { $ne: null } }),

      Notification.countDocuments({ landlord: landlordId, isRead: true }),
      Notification.countDocuments({ landlord: landlordId, isRead: false }),

      Request.countDocuments({ landlord: landlordId }),
      Request.countDocuments({ landlord: landlordId, type: 'room' }),
      Request.countDocuments({ landlord: landlordId, type: 'maintenance' }),

      Complaint.countDocuments({ landlord: landlordId, status: 'pending' }),
      Complaint.countDocuments({ landlord: landlordId, status: 'in-progress' }),
      Complaint.countDocuments({ landlord: landlordId, status: 'resolved' }),
      Complaint.countDocuments({ landlord: landlordId, status: 'cancelled' }),
    ]);

    res.status(200).json({
      landlord: req.user.username,
      rooms: {
        total: totalRooms,
        active: activeRooms,
        inactive: inactiveRooms,
        occupied: occupiedRooms
      },
      notifications: {
        read: readNotifications,
        unread: unreadNotifications
      },
      requests: {
        total: totalRequests,
        roomRequests: roomRequests,
        maintenanceRequests: maintenanceRequests
      },
      complaints: {
        total: maintenancePending + maintenanceInProgress + maintenanceResolved + maintenanceCancelled,
        pending: maintenancePending,
        inProgress: maintenanceInProgress,
        resolved: maintenanceResolved,
        cancelled: maintenanceCancelled
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};

module.exports = {
    registerLandlord,
    loginLandlord,
    getLandlordProfile,
    getLandlordDashboardStats
}