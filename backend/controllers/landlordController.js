const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const Landlord = require('../models/Landlord');
const generateToken = require('../utils/generateToken')

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

module.exports = {
    registerLandlord,
    loginLandlord,
    getLandlordProfile,
}