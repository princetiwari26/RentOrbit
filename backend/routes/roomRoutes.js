const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createRoom, getLandlordRooms, getAllRooms, updateRoomStatus, deleteRoom, getOccupiedRoomById, leaveRoom } = require('../controllers/roomController');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.array('photos', 5), (req, res, next) => {
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
},
  createRoom
);

router.get("/", protect, getLandlordRooms);
router.get("/search", getAllRooms);
router.patch('/:roomId/status', protect, updateRoomStatus);
router.delete('/:roomId', protect, deleteRoom);
router.get('/:id', protect, getOccupiedRoomById);
router.put('/leave/:roomId', protect, leaveRoom);

module.exports = router;