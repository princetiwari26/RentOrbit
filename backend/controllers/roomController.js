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

module.exports = {
  createRoom
};