const express = require("express");
const { createRequest, getRequests, updateRequestStatus, finalRoomRequestByTenant } = require("../controllers/requestController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getRequests);
router.put("/:id", protect, updateRequestStatus);
router.get("/requests-for-tenant", protect, finalRoomRequestByTenant);

module.exports = router;