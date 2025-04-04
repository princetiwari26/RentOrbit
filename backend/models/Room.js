const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  houseNumber: { type: String },
  street: { type: String },
  locality: { type: String },
  landmark: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String, default: 'India' },
});

const roomSchema = new Schema({
  accommodation: {
    type: [String],
    // required: true,
  },
  roomType: {
    type: [String],
    // required: true,
  },

  address: {
    type: addressSchema,
    // required: true
  },

  rent: {
    type: Number,
    // required: true,
    min: 0
  },
  cautionDeposit: {
    type: Number,
    // required: true,
    min: 0
  },
  securityDepositType: {
    type: String,
    // required: true
  },
  paymentPlan: {
    type: String,
    // required: true
  },

  suitableFor: {
    type: [String],
    default: []
  },
  restrictions: {
    type: [String],
    default: []
  },

  // Amenities
  // amenities: {
  //   type: [String],
  //   enum: [
  //     'Fully Furnished',
  //     'Semi-Furnished',
  //     'Unfurnished',
  //     'Wi-Fi',
  //     'AC',
  //     'Geyser',
  //     'Modular Kitchen',
  //     'Parking',
  //     'Power Backup',
  //     'Lift/Elevator',
  //     'Security',
  //     'Gym',
  //     'Swimming Pool',
  //     'Garden',
  //     'Housekeeping',
  //     'Laundry',
  //     'Meals Included',
  //     '24/7 Water Supply',
  //     'Wardrobe',
  //     'TV',
  //     'Washing Machine'
  //   ],
  //   default: []
  // },

  description: {
    type: String,
    trim: true
  },
  photos: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'occupied', 'inactive'],
    default: 'active'
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    default: null
  },

  landlord: {
    type: Schema.Types.ObjectId,
    ref: 'Landlord',
    // required: true
  },
  joiningDate: {
    type: Date,
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;