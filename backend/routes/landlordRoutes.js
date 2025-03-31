const router = require('express').Router();
const { registerLandlord, loginLandlord } = require('../controllers/landlordController');
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerLandlord);
router.post('/login', loginLandlord);

module.exports = router;