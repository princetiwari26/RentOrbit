const Room = require('../models/Room');
const asyncHandler = require('express-async-handler');

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
    // amenities,
    description,
    photos
  } = req.body;

  if (!accommodation || !roomType || !address || !rent ) {
    res.status(400);
    throw new Error('Please include all required fields');
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
    // amenities,
    description,
    photos,
    landlord: req.user.id,
    isActive: true
  });

  res.status(201).json(room);
});

const getRooms = async(req, res) => {
  try {
    // Check if the user is a landlord
    if (req.user.userType !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only landlords can view rooms.",
      });
    }

    // Get rooms where landlordId matches the authenticated user's ID
    const rooms = await Room.find({ landlord: req.user.id });

    // Check if rooms exist
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

module.exports = {
  createRoom,
  getRooms
};