// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const { createComplaint, getTenantComplaints, getLandlordComplaints, updateComplaintStatus, deleteTenantComplaint, deleteLandlordComplaint, markComplaintAsRead, getUnreadComplaintCount,  } = require('../controllers/complaintController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/tenant', protect, getTenantComplaints);
router.get('/landlord', protect, getLandlordComplaints);
router.put('/:complaintId/status', protect, updateComplaintStatus);
router.delete('/tenant/:complaintId', protect, deleteTenantComplaint);
router.delete('/landlord/:complaintId', protect, deleteLandlordComplaint);
router.put('/:complaintId/mark-read', protect, markComplaintAsRead);
router.get('/unread/count', protect, getUnreadComplaintCount);

module.exports = router;
