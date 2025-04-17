const Request = require('../models/Request');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');
const Notification = require('../models/Notification');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const moment = require("moment");

const createRequest = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.userType !== 'tenant') {
            return res.status(403).json({ message: "Only tenants can request visits." });
        }

        const { roomId, visitDate, message } = req.body;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        const tenant = await Tenant.findById(decoded.id).select("name email");
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found." });
        }

        const newRequest = new Request({
            tenant: decoded.id,
            landlord: room.landlord,
            room: roomId,
            visitDate,
            message,
            newRequest: true
        });

        await newRequest.save();

        const notification = new Notification({
            tenant: decoded.id,
            landlord: room.landlord,
            room: roomId,
            request: newRequest._id,
            title: `Room request from tenant ${tenant.name}`,
            message: `${tenant.name} has requested to visit your room at ${room.address.locality}, ${room.address.city}.`,
            notificationType: 'roomRequest',
            status: 'pending',
            isRead: false
        });
        await notification.save();

        res.status(201).json({ message: "Request created successfully.", request: newRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getRequests = asyncHandler(async (req, res) => {
    const { userType, id } = req.user;

    let requests;

    if (userType === "tenant") {
        requests = await Request.find({ tenant: id })
            .populate("landlord", "name email phone")
            .populate("room", "accommodation roomType address rent");
    } else if (userType === "landlord") {
        requests = await Request.find({ landlord: id })
            .populate("tenant", "name email phone")
            .populate("room", "accommodation roomType address rent");
    } else {
        return res.status(403).json({ message: "Invalid user type" });
    }

    res.status(200).json(requests);
});

const updateRequestStatus = asyncHandler(async (req, res) => {
    const { userType, id: userId } = req.user;
    const { action } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
        return res.status(404).json({ message: "Request not found." });
    }

    const requestTenantId = request.tenant.toString();
    const requestLandlordId = request.landlord.toString();

    if (action === "tenant-cancel") {
        if (userType !== "tenant" || requestTenantId !== userId) {
            return res.status(403).json({ message: "Unauthorized action for tenant." });
        }
        await request.deleteOne();

        const notification = new Notification({
            tenant: userId,
            landlord: request.landlord,
            room: request.room,
            request: request._id,
            title: `Tenant cancelled the room request`,
            message: `The tenant has cancelled the room request.`,
            notificationType: 'roomStatus',
            status: 'tenant-cancelled',
            isRead: false
        });
        await notification.save();

        return res.status(200).json({ message: "Request successfully cancelled." });
    }

    if (action === "approve") {
        if (userType !== "landlord" || requestLandlordId !== userId) {
            return res.status(403).json({ message: "Unauthorized action for landlord." });
        }
        request.newRequest = false
        request.status = "approve";
        await request.save();

        const notification = new Notification({
            tenant: request.tenant,
            landlord: userId,
            room: request.room,
            request: request._id,
            title: `Request approved by landlord`,
            message: `The landlord has approved your room request.`,
            notificationType: 'roomStatus',
            status: 'approve',
            isRead: false
        });
        await notification.save();

        return res.status(200).json({ message: "Request approved.", request });
    }

    if (action === "landlord-cancel") {
        if (userType !== "landlord" || requestLandlordId !== userId) {
            return res.status(403).json({ message: "Unauthorized action for landlord." });
        }
        request.newRequest = false
        request.status = "cancelled";
        await request.save();

        const notification = new Notification({
            tenant: request.tenant,
            landlord: userId,
            room: request.room,
            request: request._id,
            title: `Request cancelled by landlord`,
            message: `The landlord has cancelled your room request.`,
            notificationType: 'roomStatus',
            status: 'landlord-cancelled',
            isRead: false
        });
        await notification.save();

        return res.status(200).json({ message: "Request cancelled by landlord.", request });
    }

    if (action === "tenant-confirm") {
        if (userType !== "tenant" || requestTenantId !== userId) {
            return res.status(403).json({ message: "Unauthorized action for tenant." });
        }

        const room = await Room.findById(request.room);

        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        if (room.tenant) {
            return res.status(400).json({ message: "Room is already occupied by another tenant." });
        }

        room.roomStatus = "Occupied";
        room.isActive = true;
        room.tenant = userId;
        room.joiningDate = new Date();
        await room.save();

        request.status = "completed";
        await request.save();

        await Tenant.findByIdAndUpdate(userId, {
            $push: { roomsOccupied: room._id }
        });

        const notification = new Notification({
            tenant: userId,
            landlord: request.landlord,
            room: request.room,
            request: request._id,
            title: `Tenant confirmed the room`,
            message: `The tenant has confirmed the room and taken possession.`,
            notificationType: 'roomStatus',
            status: 'confirmed',
            isRead: false
        });
        await notification.save();

        return res.status(200).json({ message: "Room confirmed by tenant.", request });
    }

    return res.status(400).json({ message: "Invalid action type." });
});

const finalRoomRequestByTenant = async (req, res) => {
    try {
        const tenantId = req.user.id;
        const today = moment().startOf("day").toDate();

        const requests = await Request.find({
            tenant: tenantId,
            status: "approve",
            visitDate: { $gte: today, $lt: moment(today).endOf("day").toDate() }
        }).populate({
            path: "room",
            populate: [
                { path: "landlord", select: "name phone email" },
                { path: "tenant", select: "_id" }
            ]
        });

        const availableRequests = requests.filter(request => !request.room?.tenant);

        if (availableRequests.length === 0) {
            return res.status(404).json({ message: "No confirmed available requests found for today." });
        }

        res.json(availableRequests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server Error" });
        }
    }
};

const marksRoomRequestAsRead = async (req, res) => {
    try {
        const { roomRequestId } = req.params;

        const roomRequest = await Request.findById(roomRequestId)
        if (!roomRequest.isRead) {
            roomRequest.isRead = true;
            await roomRequest.save();
        }

        res.status(200).json({ message: 'Marked as read', roomRequest })
    } catch (error) {
        console.log(error);
    }
}

const getUnreadRoomRequestCount = async (req, res) => {
    try {
        const landlordId = req.user.id;

        const count = await Request.countDocuments({
            landlord: landlordId,
            isRead: false,
        });

        res.status(200).json({ unreadCount: count });
    } catch (error) {
        console.error('Unread Count Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createRequest,
    getRequests,
    updateRequestStatus,
    finalRoomRequestByTenant,
    marksRoomRequestAsRead,
    getUnreadRoomRequestCount
};