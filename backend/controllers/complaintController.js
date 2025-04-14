const Complaint = require('../models/Complaint');
const Room = require('../models/Room');

// ✅ Tenant: Create Complaint (already implemented)
exports.createComplaint = async (req, res) => {
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
    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Tenant: Get All Their Complaints
exports.getTenantComplaints = async (req, res) => {
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

// ✅ Landlord: Get All Complaints Related to Their Rooms
exports.getLandlordComplaints = async (req, res) => {
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

// ✅ Update Complaint Status (used by tenant or landlord/admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    const allowedStatus = ['in-progress', 'resolved', 'rejected', 'cancelled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: 'Complaint status updated', complaint });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Tenant: Soft Delete Complaint
exports.deleteTenantComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const tenantId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.tenant.toString() !== tenantId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    complaint.visible = false;
    await complaint.save();

    res.status(200).json({ message: 'Complaint deleted (hidden)' });
  } catch (error) {
    console.error('Tenant Delete Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Landlord: Soft Delete Complaint (also set status = cancelled)
exports.deleteLandlordComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const landlordId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.landlord.toString() !== landlordId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    complaint.visible = false;
    complaint.status = 'cancelled';
    await complaint.save();

    res.status(200).json({ message: 'Complaint hidden and cancelled' });
  } catch (error) {
    console.error('Landlord Delete Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};