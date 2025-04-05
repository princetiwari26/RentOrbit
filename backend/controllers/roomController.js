const Room = require('../models/Room');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dfilgwps9',
  api_key: '461796494297831',
  api_secret: '9tzOAIAPEH_o5-2BSOz9DD98oXE'
});

const createRoom = asyncHandler(async (req, res) => {
  if (req.user.userType !== 'landlord') {
    res.status(403);
    throw new Error('Not authorized to add rooms');
  }

  const {
    accommodation,
    roomType,
    address,
    rent,
    cautionDeposit,
    securityDepositType,
    paymentPlan,
    suitableFor,
    restrictions,
    description
  } = req.body;

  if (!accommodation || !roomType || !address || !rent ) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  // Handle file uploads
  let imageUrls = [];
  if (req.files && req.files.photos) {
    const files = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    
    try {
      // Upload each image to Cloudinary
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'room_images'
        });
        imageUrls.push(result.secure_url);
      }
    } catch (error) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  // Create the room
  const room = await Room.create({
    accommodation,
    roomType,
    address,
    rent,
    cautionDeposit,
    securityDepositType,
    paymentPlan,
    suitableFor,
    restrictions,
    description,
    photos: imageUrls,
    landlord: req.user.id,
    isActive: true,
    roomStatus: 'Active',
  });

  res.status(201).json(room);
});

module.exports = {
  createRoom
};

const getLandlordRooms = async(req, res) => {
  try {
    if (req.user.userType !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only landlords can view rooms.",
      });
    }

    const rooms = await Room.find({ landlord: req.user.id });

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms found for this landlord.",
        id: req.user.id,
      });
    }

    res.status(200).json({
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

module.exports = {
  createRoom,
  getLandlordRooms,
  getAllRooms,
  getRoomById,
};