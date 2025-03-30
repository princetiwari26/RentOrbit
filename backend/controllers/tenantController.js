const bcrypt = require("bcryptjs");
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

        // Hash the password
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
          token: generateToken(tenant._id, "tenant"), // Including userType
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Tenant Dashboard
const tenantDashboard = (req, res) => {
    res.json({ message: `Welcome to Tenant Dashboard, ${req.tenant.name}` });
};

module.exports = { registerTenant, loginTenant, tenantDashboard };
