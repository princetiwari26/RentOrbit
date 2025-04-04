const express = require("express");
const { registerTenant, loginTenant, getTenantProfile } = require("../controllers/tenantController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerTenant);
router.post("/login", loginTenant);
router.get("/profile", protect, getTenantProfile);

module.exports = router;