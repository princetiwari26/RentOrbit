const express = require("express");
const { registerTenant, loginTenant, tenantDashboard } = require("../controllers/tenantController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register Tenant
router.post("/register", registerTenant);

// Login Tenant
router.post("/login", loginTenant);

// Tenant Dashboard (Protected)
router.get("/dashboard", protect, tenantDashboard);

module.exports = router;
