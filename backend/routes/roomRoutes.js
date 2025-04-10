const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createRoom, getLandlordRooms, getAllRooms } = require('../controllers/roomController');
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

module.exports = router;