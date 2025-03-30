const express = require("express");
const { registerTenant, loginTenant, tenantDashboard } = require("../controllers/tenantController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerTenant);
router.post("/login", loginTenant);
router.get("/dashboard", protect, tenantDashboard);

module.exports = router;
