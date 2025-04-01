const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schemas
const maintenanceRequestSchema = new Schema({
  room: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true 
  },
  tenant: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tenant',
    required: true 
  },
  type: {
    type: String,
    enum: ['Plumbing', 'Electrical', 'HVAC', 'Structural', 'Appliance', 'Other'],
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium'
  },
  completionDate: Date
}, { timestamps: true });

const amenityStatusSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Electricity', 'Plumbing', 'Internet', 'Security', 'HVAC', 'Lift/Elevator']
  },
  status: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastChecked: Date
});

const tenantFeedbackSchema = new Schema({
  tenant: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tenant',
    required: true 
  },
  room: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true 
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: String
}, { timestamps: true });

const activityLogSchema = new Schema({
  type: {
    type: String,
    enum: ['Maintenance', 'Inspection', 'Lease', 'Tenant', 'System', 'Other'],
    required: true
  },
  action: String,
  description: String,
  initiatedBy: {
    type: String,
    enum: ['Tenant', 'Landlord', 'System']
  },
  relatedRoom: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }
}, { timestamps: true });

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['Inspection', 'Maintenance', 'Lease', 'Move-In', 'Move-Out', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  location: String,
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Tenant'
  }]
}, { timestamps: true });

// Main Property Management Schema
const propertyManagementSchema = new Schema({
  landlord: {
    type: Schema.Types.ObjectId,
    ref: 'Landlord',
    required: true,
    unique: true
  },
  maintenanceRequests: [maintenanceRequestSchema],
  amenityStatus: [amenityStatusSchema],
  tenantFeedback: [tenantFeedbackSchema],
  activityLog: [activityLogSchema],
  events: [eventSchema],
  // Cached statistics for dashboard performance
  stats: {
    totalProperties: Number,
    occupiedProperties: Number,
    vacantProperties: Number,
    maintenancePending: Number,
    maintenanceCompleted: Number,
    avgTenantRating: Number,
    lastUpdated: Date
  }
}, { timestamps: true });

const PropertyManagement = mongoose.model('PropertyManagement', propertyManagementSchema);

module.exports = PropertyManagement;