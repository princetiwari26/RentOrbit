const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createRoom, getLandlordRooms, getAllRooms } = require('../controllers/roomController');

router.post('/', protect,  createRoom);
router.get("/", protect, getLandlordRooms);
router.get("/search", getAllRooms);

module.exports = router;