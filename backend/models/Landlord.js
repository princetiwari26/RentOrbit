const mongoose = require('mongoose')

const landlordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    activeRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }]
}, { timestamps: true });

module.exports = mongoose.model("Landlord", landlordSchema);