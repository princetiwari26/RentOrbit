const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler')
const Tenant = require("../models/Tenant");
const generateToken = require("../utils/generateToken");

// Register Tenant
const registerTenant = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const existingTenant = await Tenant.findOne({ email });

        if (existingTenant) {
            return res.status(400).json({ message: "Tenant already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const tenant = await Tenant.create({ name, email, phone, password: hashedPassword });

        if (tenant) {
            res.status(201).json({
                _id: tenant._id,
                name: tenant.name,
                email: tenant.email,
                phone: tenant.phone,
                token: generateToken(tenant._id),
            });
        } else {
            res.status(400).json({ message: "Invalid tenant data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login Tenant
const loginTenant = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const tenant = await Tenant.findOne({ email });
  
      if (tenant && (await bcrypt.compare(password, tenant.password))) {
        res.json({
          name: tenant.name,
          token: generateToken(tenant._id, "tenant"),
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getTenantProfile = asyncHandler(async (req, res) => {
    if (req.user.userType !== "tenant") {
      return res.status(403).json({ message: "Unauthorized action for tenant" });
    }
  
    const tenant = await Tenant.findById(req.user.id).select("-password");
  
    if (!tenant) {
      return res.status(404).json({ message: "Tenant profile not found" });
    }
  
    res.status(200).json(tenant);
  });

module.exports = { registerTenant, loginTenant, getTenantProfile };
