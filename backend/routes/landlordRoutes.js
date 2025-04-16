const router = require('express').Router();
const { registerLandlord, loginLandlord, getLandlordProfile, getLandlordDashboardStats } = require('../controllers/landlordController');
const protect = require('../middleware/authMiddleware')

router.post('/register', registerLandlord);
router.post('/login', loginLandlord);
router.get("/profile", protect, getLandlordProfile);
router.get('/dashboard', protect, getLandlordDashboardStats);

module.exports = router;