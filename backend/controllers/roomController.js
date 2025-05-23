const Room = require('../models/Room');
const Request = require('../models/Request')
const Notification = require('../models/Notification')
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});



const createRoom = asyncHandler(async (req, res) => {
  if (req.user.userType !== 'landlord') {
    res.status(403);
    throw new Error('Not authorized to add rooms');
  }

  if (!req.body.accommodation || !req.body.roomType || !req.body.address || !req.body.rent) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }

  if (req.files.length > 5) {
    res.status(400);
    throw new Error('Maximum 5 images allowed');
  }

  let imageUrls = [];
  try {
    for (const file of req.files) {
      const compressedPath = path.join(__dirname, '../temp/uploads/', 'compressed-' + file.filename);
    
      try {
        await sharp(file.path)
          .resize({ width: 1200 })
          .jpeg({ quality: 80 })
          .toFile(compressedPath);
    
        const result = await cloudinary.uploader.upload(compressedPath, {
          folder: 'room_images',
          timeout: 30000,
        });
    
        imageUrls.push(result.secure_url);
        console.log('Uploaded:', result.secure_url);
      } catch (uploadError) {
        console.error('Cloudinary upload failed raw:', uploadError);
        throw new Error('Cloudinary upload failed');
      } finally {
        try {
          fs.unlinkSync(file.path);
          fs.unlinkSync(compressedPath);
        } catch (unlinkError) {
          console.error('Temp file cleanup error:', unlinkError);
        }
      }
    }
    
    const accommodation = JSON.parse(req.body.accommodation);
    const roomType = JSON.parse(req.body.roomType);
    const address = JSON.parse(req.body.address);
    const suitableFor = JSON.parse(req.body.suitableFor || '[]');
    const restrictions = JSON.parse(req.body.restrictions || '[]');

    const room = await Room.create({
      accommodation,
      roomType,
      address,
      rent: req.body.rent,
      cautionDeposit: req.body.cautionDeposit,
      securityDepositType: req.body.securityDepositType,
      paymentPlan: req.body.paymentPlan,
      suitableFor,
      restrictions,
      description: req.body.description,
      photos: imageUrls,
      landlord: req.user.id,
      isActive: true,
      roomStatus: 'Active',
    });

    res.status(201).json(room);
  } catch (error) {
    console.error('Cloudinary upload failed:', error.message, error.name, error.http_code, error.stack);
    res.status(500);
    throw new Error('Failed to create room');
  }

});

const getLandlordRooms = async (req, res) => {
  try {
    if (req.user.userType !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only landlords can view rooms.",
      });
    }

    const rooms = await Room.find({ landlord: req.user.id });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
    
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch rooms",
    });
  }
}

const getAllRooms = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      accommodationType,
      roomType,
      city,
      state,
      tenantsAllowed,
      deposit
    } = req.query;

    const filter = {
      roomStatus: 'Active'
    };

    if (minPrice || maxPrice) {
      filter.rent = {};
      if (minPrice) filter.rent.$gte = parseInt(minPrice);
      if (maxPrice) filter.rent.$lte = parseInt(maxPrice);
    }

    if (accommodationType) {
      filter.accommodation = { $in: accommodationType.split(',') };
    }

    if (roomType) {
      filter.roomType = { $in: roomType.split(',') };
    }

    if (city) {
      filter['address.city'] = new RegExp(city, 'i'); // Case insensitive
    }

    if (state) {
      filter['address.state'] = new RegExp(state, 'i');
    }

    if (tenantsAllowed) {
      filter.tenant = { $in: tenantsAllowed.split(',') };
    }

    if (deposit) {
      filter.deposit = { $in: deposit.split(',') };
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { 'address.houseNumber': searchRegex },
        { 'address.street': searchRegex },
        { 'address.locality': searchRegex },
        { 'address.landmark': searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex }
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Room.countDocuments(filter);

    const rooms = await Room.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rooms.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: rooms
    });

  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rooms'
    });
  }
};


const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });

  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room'
    });
  }
};

const updateRoomStatus = async (req, res) => {
  const { roomId } = req.params;
  const { isActive } = req.body;

  if (req.user.userType !== 'landlord') {
    return res.status(403).json({ message: 'Only landlords can update room status' });
  }

  try {
    const room = await Room.findOne({ _id: roomId, landlord: req.user.id });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or not authorized' });
    }

    room.isActive = isActive;
    room.roomStatus = isActive ? 'Active' : 'Inactive';

    await room.save();

    res.status(200).json({ message: 'Room status updated', room });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room status', error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const { roomId } = req.params;

  if (req.user.userType !== 'landlord') {
    return res.status(403).json({ message: 'Only landlords can delete rooms' });
  }

  try {
    const room = await Room.findOneAndDelete({ _id: roomId, landlord: req.user.id });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or not authorized' });
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

const getOccupiedRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Ensure only tenant can access
  if (req.user.userType !== 'tenant') {
    res.status(403);
    throw new Error('Access denied. Only tenants can view this room.');
  }

  const room = await Room.findOne({ _id: id, roomStatus: 'Occupied' })
    .populate('landlord', 'name email')
    .populate('tenant', 'name email')
    .lean();

  if (!room) {
    res.status(404);
  }

  res.status(200).json(room);
});

const leaveRoom = asyncHandler(async (req, res) => {
  const { id: tenantId, userType } = req.user;
  const { roomId } = req.params;

  if (userType !== 'tenant') {
    return res.status(403).json({ message: 'Only tenants can perform this action' });
  }

  const room = await Room.findById(roomId);

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  if (!room.tenant || room.tenant.toString() !== tenantId) {
    return res.status(403).json({ message: 'You are not assigned to this room' });
  }

  // Find and delete the completed request
  const request = await Request.findOneAndDelete({
    tenant: tenantId,
    room: roomId,
    status: 'completed',
  });

  // Create notification if request was found and deleted
  if (request) {
    const notification = new Notification({
      tenant: tenantId,
      landlord: request.landlord,
      room: roomId,
      request: request._id,
      title: `Tenant Left the Room`,
      message: `The tenant has left the room.`,
      notificationType: 'roomStatus',
      status: 'tenant-leave',
      isRead: false,
    });
    await notification.save();
  }

  // Update room: remove tenant, joiningDate and set status to Active
  room.tenant = null;
  room.joiningDate = null;
  room.roomStatus = 'Active';

  await room.save();

  res.status(200).json({ message: 'You have successfully left the room', room });
});


module.exports = {
  createRoom,
  getLandlordRooms,
  getAllRooms,
  getRoomById,
  updateRoomStatus,
  deleteRoom,
  getOccupiedRoomById,
  leaveRoom
};