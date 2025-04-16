const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const Room = require('../models/Room');

const createComplaint = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { roomId, type, description } = req.body;

    if (!roomId || !type || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const room = await Room.findById(roomId).populate('landlord');
    if (!room || !room.tenant || room.tenant.toString() !== tenantId) {
      return res.status(403).json({ message: 'Unauthorized or Room not found' });
    }

    const complaint = new Complaint({
      tenant: tenantId,
      landlord: room.landlord._id,
      room: room._id,
      type,
      description
    });
    await complaint.save();

    const notification = new Notification({
      tenant: tenantId,
      landlord: room.landlord._id,
      room: room._id,
      request: complaint._id,
      title: type,
      message: description,
      notificationType: 'maintenance',
      status: 'pending',
      isRead: false
    });
    await notification.save();

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getTenantComplaints = async (req, res) => {
  try {
    const tenantId = req.user.id;

    const complaints = await Complaint.find({ tenant: tenantId, visible: true })
      .populate('room')
      .populate('landlord');

    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get Tenant Complaints Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getLandlordComplaints = async (req, res) => {
  try {
    const landlordId = req.user.id;

    const complaints = await Complaint.find({ landlord: landlordId, visible: true })
      .populate('tenant')
      .populate('room');

    res.status(200).json({ complaints });
  } catch (error) {
    console.error('Get Landlord Complaints Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userType = req.user.userType;

    const allowedStatus = ['in-progress', 'resolved', 'rejected', 'cancelled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(complaintId).populate('room');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    const type = complaint.type;

    let title = '';
    let message = '';

    switch (status) {
      case 'in-progress':
        title = `${type} Complaint In Progress`;
        message = `Your ${type.toLowerCase()} complaint is being looked into.`;
        break;
      case 'resolved':
        title = `${type} Complaint Resolved`;
        message = `Your ${type.toLowerCase()} complaint has been resolved.`;
        break;
      case 'rejected':
        title = `${type} Complaint Rejected`;
        message = `Your ${type.toLowerCase()} complaint was rejected.`;
        break;
      case 'cancelled':
        title = `${type} Complaint Cancelled`;
        message = `Your ${type.toLowerCase()} complaint was cancelled.`;
        break;
    }

    const notification = new Notification({
      tenant: complaint.tenant,
      landlord: complaint.landlord,
      room: complaint.room._id,
      request: complaint._id,
      title,
      message,
      notificationType: 'maintenance',
      status: status === 'cancelled' && userType === 'tenant' ? 'tenant-cancel' : status,
      isRead: false
    });
    await notification.save();

    res.status(200).json({ message: 'Complaint status updated', complaint });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteTenantComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const tenantId = req.user.id;

    const complaint = await Complaint.findById(complaintId).populate('room');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.tenant.toString() !== tenantId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    complaint.visible = false;
    complaint.status = 'cancelled';
    await complaint.save();

    const notification = new Notification({
      tenant: tenantId,
      landlord: complaint.landlord,
      room: complaint.room._id,
      request: complaint._id,
      title: 'Complaint Cancelled by Tenant',
      message: 'The tenant has cancelled the complaint.',
      notificationType: 'maintenance',
      status: 'tenant-cancel',
      isRead: false
    });
    await notification.save();

    res.status(200).json({ message: 'Complaint deleted (hidden)' });
  } catch (error) {
    console.error('Tenant Delete Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteLandlordComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const landlordId = req.user.id;

    const complaint = await Complaint.findById(complaintId).populate('room');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.landlord.toString() !== landlordId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    complaint.visible = false;
    complaint.status = 'cancelled';
    await complaint.save();

    const notification = new Notification({
      tenant: complaint.tenant,
      landlord: landlordId,
      room: complaint.room._id,
      request: complaint._id,
      title: 'Complaint Cancelled by Landlord',
      message: 'The landlord has cancelled the complaint.',
      notificationType: 'maintenance',
      status: 'cancelled',
      isRead: false
    });
    await notification.save();

    res.status(200).json({ message: 'Complaint hidden and cancelled' });
  } catch (error) {
    console.error('Landlord Delete Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const markComplaintAsRead = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const landlordId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.landlord.toString() !== landlordId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    if (!complaint.isRead) {
      complaint.isRead = true;
      await complaint.save();
    }

    res.status(200).json({ message: 'Marked as read', complaint });
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUnreadComplaintCount = async (req, res) => {
  try {
    const landlordId = req.user.id;

    const count = await Complaint.countDocuments({
      landlord: landlordId,
      isRead: false,
      visible: true
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Unread Count Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createComplaint,
  getTenantComplaints,
  getLandlordComplaints,
  updateComplaintStatus,
  deleteTenantComplaint,
  deleteLandlordComplaint,
  markComplaintAsRead,
  getUnreadComplaintCount
}