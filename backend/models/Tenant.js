const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  roomsOccupied: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Room',
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Tenant", tenantSchema);